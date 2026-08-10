import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Icon,
  Table,
  Button,
} from "@chakra-ui/react";
import { BookOpen, MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { Link, useNavigate } from "react-router-dom";
import { APP_BASE_URL } from "../utils/api";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

/** Raw shape of the rows returned by GET /bookings */
interface RawBooking {
  id: number;
  client_id: number;
  turf_id: number;
  date: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  price: number | null;
  status: BookingStatus | null;
  payment_transaction_id: string | null;
}

/** Only the turf fields this page displays */
interface RawTurf {
  id: number;
  name: string;
  address: string;
}

interface ClientBooking {
  id: string;
  turfId: number;
  turfName: string;
  turfAddress: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  status: BookingStatus;
  /** 1-based position within a multi-slot booking, null when it stands alone */
  slotIndex: number | null;
  slotCount: number;
}

const ClientPastBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const client = JSON.parse(localStorage.getItem("client") ?? "{}");
  const clientId = client?.id ?? null;

  const [upcomingBookings, setUpcomingBookings] = useState<ClientBooking[]>([]);
  const [pastBookings, setPastBookings] = useState<ClientBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const rowHoverBg = useColorModeValue("gray.50", "gray.700");

  const formatTime = (time: string) => {
    if (!time) return "—";
    const [hoursStr, minutes] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const meridiem = hours >= 12 ? "PM" : "AM";
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return `${String(hours).padStart(2, "0")}:${minutes} ${meridiem}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "pending":
        return "yellow";
      case "completed":
        return "blue";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!clientId) {
        navigate("/login", { replace: true });
        return;
      }

      setIsLoading(true);
      setFetchError(null);

      try {
        const [bookingsRes, turfsRes] = await Promise.all([
          fetch(`${APP_BASE_URL}/bookings`),
          fetch(`${APP_BASE_URL}/turfs`),
        ]);

        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        if (!turfsRes.ok) throw new Error("Failed to fetch turfs");

        const { bookings } = (await bookingsRes.json()) as {
          bookings: RawBooking[];
        };
        const { turfs } = (await turfsRes.json()) as { turfs: RawTurf[] };

        const turfMap = new Map(turfs.map((t) => [t.id, t]));
        const now = new Date();

        // Filter bookings for this client only
        const clientBookings = bookings.filter((b) => b.client_id === clientId);

        // Slots booked together in one purchase share a transaction id, so we
        // can label them "Slot 2 of 3" instead of showing three unrelated rows.
        const slotCounts = new Map<string, number>();
        clientBookings.forEach((b) => {
          if (!b.payment_transaction_id) return;
          const key = String(b.payment_transaction_id);
          slotCounts.set(key, (slotCounts.get(key) ?? 0) + 1);
        });

        const seenInGroup = new Map<string, number>();

        const endOf = (b: RawBooking) =>
          new Date(`${b.date}T${(b.end_time ?? "23:59:59").substring(0, 8)}`);
        const startOf = (b: RawBooking) =>
          new Date(`${b.date}T${b.start_time.substring(0, 8)}`);

        const toClientBooking = (b: RawBooking): ClientBooking => {
          const turf = turfMap.get(b.turf_id);
          const groupKey = b.payment_transaction_id
            ? String(b.payment_transaction_id)
            : null;
          const slotCount = groupKey ? (slotCounts.get(groupKey) ?? 1) : 1;

          let slotIndex: number | null = null;
          if (groupKey && slotCount > 1) {
            slotIndex = (seenInGroup.get(groupKey) ?? 0) + 1;
            seenInGroup.set(groupKey, slotIndex);
          }

          return {
            id: `TK-${b.id}`,
            turfId: b.turf_id,
            turfName: turf?.name ?? "Unknown Turf",
            turfAddress: turf?.address ?? "—",
            date: formatDate(b.date),
            time: formatTime(b.start_time.substring(0, 8)),
            duration: b.duration_minutes,
            amount: b.price ?? 0,
            status: b.status ?? "pending",
            slotIndex,
            slotCount,
          };
        };

        // Soonest first, so the next thing they need to show up for is on top
        const upcoming = clientBookings
          .filter((b) => endOf(b) >= now)
          .sort((a, b) => startOf(a).getTime() - startOf(b).getTime())
          .map(toClientBooking);

        // Most recent first
        const past = clientBookings
          .filter((b) => endOf(b) < now)
          .sort((a, b) => startOf(b).getTime() - startOf(a).getTime())
          .map(toClientBooking);

        setUpcomingBookings(upcoming);
        setPastBookings(past);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load bookings",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderBookingsTable = (
    bookings: ClientBooking[],
    actionLabel: string,
  ) => (
    <Box
      bg={cardBg}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      overflow="hidden"
    >
      <Box overflowX="auto">
        <Table.Root>
          <Table.Header bg={tableHeaderBg}>
            <Table.Row>
              <Table.ColumnHeader>Booking ID</Table.ColumnHeader>
              <Table.ColumnHeader>Turf</Table.ColumnHeader>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
              <Table.ColumnHeader>Time</Table.ColumnHeader>
              <Table.ColumnHeader>Duration</Table.ColumnHeader>
              <Table.ColumnHeader>Amount</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {bookings.map((booking) => (
              <Table.Row key={booking.id} _hover={{ bg: rowHoverBg }}>
                <Table.Cell fontWeight="semibold" fontSize="sm">
                  <VStack align="start" gap={0}>
                    <Text>{booking.id}</Text>
                    {booking.slotIndex !== null && (
                      <Text fontSize="xs" color="fg.muted" fontWeight="normal">
                        Slot {booking.slotIndex} of {booking.slotCount}
                      </Text>
                    )}
                  </VStack>
                </Table.Cell>
                <Table.Cell>
                  <VStack align="start" gap={0}>
                    <Text fontSize="sm" fontWeight="medium">
                      {booking.turfName}
                    </Text>
                    <HStack color="fg.muted">
                      <Icon as={MapPin} boxSize={3} />
                      <Text fontSize="xs">{booking.turfAddress}</Text>
                    </HStack>
                  </VStack>
                </Table.Cell>
                <Table.Cell>
                  <HStack>
                    <Icon as={Calendar} boxSize={4} color="fg.subtle" />
                    <Text fontSize="sm">{booking.date}</Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell>
                  <HStack>
                    <Icon as={Clock} boxSize={4} color="fg.subtle" />
                    <Text fontSize="sm">{booking.time}</Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell fontSize="sm">{booking.duration} min</Table.Cell>
                <Table.Cell fontWeight="semibold" fontSize="sm">
                  Rs {booking.amount.toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={getStatusColor(booking.status)}
                    borderRadius="full"
                    px={3}
                    py={1}
                    textTransform="capitalize"
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/turf-details/${booking.turfId}`}>
                    <Button
                      size="sm"
                      colorPalette="green"
                      variant="outline"
                      borderRadius="full"
                    >
                      {actionLabel}
                    </Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );

  const renderEmptyState = (title: string, description: string) => (
    <Box
      bg={cardBg}
      p={12}
      borderRadius="xl"
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={borderColor}
      textAlign="center"
    >
      <VStack gap={4}>
        <Icon as={BookOpen} boxSize={12} color="fg.subtle" />
        <Heading as="h3" size="md" color="fg.muted">
          {title}
        </Heading>
        <Text fontSize="sm" color="fg.subtle" maxW="sm">
          {description}
        </Text>
        <Link to="/">
          <Button colorPalette="green" mt={2}>
            Browse Turfs
          </Button>
        </Link>
      </VStack>
    </Box>
  );

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="green.500" />
          <Text color="fg.muted">Loading your bookings...</Text>
        </VStack>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={2}>
          <Text color="red.500" fontWeight="semibold">
            Failed to load bookings
          </Text>
          <Text fontSize="sm" color="fg.muted">
            {fetchError}
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg} py={8}>
      <Container maxW="container.xl">
        <VStack gap={10} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Heading as="h1" size="xl">
                My Bookings
              </Heading>
              <Text color="fg.muted" fontSize="sm">
                Showing all upcoming and past bookings for{" "}
                {client?.name ?? "you"}
              </Text>
            </VStack>
            <Link to="/">
              <Button variant="outline" colorPalette="green" size="sm">
                <ArrowLeft size={16} />
                Back to Home
              </Button>
            </Link>
          </HStack>

          {/* Upcoming */}
          <VStack gap={4} align="stretch">
            <HStack gap={3}>
              <Heading as="h2" size="lg">
                Upcoming Bookings
              </Heading>
              {upcomingBookings.length > 0 && (
                <Badge colorPalette="green" borderRadius="full" px={3} py={1}>
                  {upcomingBookings.length}
                </Badge>
              )}
            </HStack>

            {upcomingBookings.length === 0
              ? renderEmptyState(
                  "No Upcoming Bookings",
                  "You have no bookings coming up. Browse our turfs and reserve your next slot!",
                )
              : renderBookingsTable(upcomingBookings, "View Turf")}
          </VStack>

          {/* Past */}
          <VStack gap={4} align="stretch">
            <HStack gap={3}>
              <Heading as="h2" size="lg">
                Past Bookings
              </Heading>
              {pastBookings.length > 0 && (
                <Badge colorPalette="gray" borderRadius="full" px={3} py={1}>
                  {pastBookings.length}
                </Badge>
              )}
            </HStack>

            {pastBookings.length === 0
              ? renderEmptyState(
                  "No Past Bookings",
                  "You haven't completed any bookings yet. Your booking history will show up here.",
                )
              : renderBookingsTable(pastBookings, "Book Again")}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default ClientPastBookingsPage;
