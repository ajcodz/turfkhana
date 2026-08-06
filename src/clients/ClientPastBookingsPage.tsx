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


interface PastBooking {
  id: string;
  turfId: number;
  turfName: string;
  turfAddress: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}

const ClientPastBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const client = JSON.parse(localStorage.getItem("client") ?? "{}");
  const clientId = client?.id ?? null;

  const [pastBookings, setPastBookings] = useState<PastBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
    const fetchPastBookings = async () => {
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

        const { bookings } = await bookingsRes.json();
        const { turfs } = await turfsRes.json();

        const turfMap = new Map(turfs.map((t: any) => [t.id, t]));
        const now = new Date();

        // Filter bookings for this client only
        const clientBookings = bookings.filter(
          (b: any) => b.client_id === clientId,
        );

        // Filter only past bookings
        const past = clientBookings.filter((b: any) => {
          const cleanEndTime = (b.end_time ?? "23:59:59").substring(0, 8);
          const endDateTime = new Date(`${b.date}T${cleanEndTime}`);
          return endDateTime < now;
        });

        // Sort by most recent first
        past.sort((a: any, b: any) => {
          const dateA = new Date(`${a.date}T${a.start_time.substring(0, 8)}`);
          const dateB = new Date(`${b.date}T${b.start_time.substring(0, 8)}`);
          return dateB.getTime() - dateA.getTime();
        });

        const mapped: PastBooking[] = past.map((b: any) => {
          const turf = turfMap.get(b.turf_id) as any;
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
          };
        });

        setPastBookings(mapped);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load bookings",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPastBookings();
  }, []);

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
          <Text color="gray.600">Loading your bookings...</Text>
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
          <Text fontSize="sm" color="gray.500">
            {fetchError}
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} py={8}>
      <Container maxW="container.xl">
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Heading as="h1" size="xl">
                Past Bookings
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Showing all past bookings for {client?.name ?? "you"}
              </Text>
            </VStack>
            <Link to="/">
              <Button variant="outline" colorPalette="green" size="sm">
                <ArrowLeft size={16} />
                Back to Home
              </Button>
            </Link>
          </HStack>

          {/* Content */}
          {pastBookings.length === 0 ? (
            <Box
              bg={cardBg}
              p={16}
              borderRadius="xl"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={borderColor}
              textAlign="center"
            >
              <VStack gap={4}>
                <Icon as={BookOpen} boxSize={16} color="gray.300" />
                <Heading as="h3" size="md" color="gray.500">
                  No Past Bookings
                </Heading>
                <Text fontSize="sm" color="gray.400" maxW="sm">
                  You haven't made any bookings yet. Browse our turfs and make
                  your first booking!
                </Text>
                <Link to="/">
                  <Button colorPalette="green" mt={2}>
                    Browse Turfs
                  </Button>
                </Link>
              </VStack>
            </Box>
          ) : (
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
                  <Table.Header bg={useColorModeValue("gray.50", "gray.700")}>
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
                    {pastBookings.map((booking) => (
                      <Table.Row
                        key={booking.id}
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.700"),
                        }}
                      >
                        <Table.Cell fontWeight="semibold" fontSize="sm">
                          {booking.id}
                        </Table.Cell>
                        <Table.Cell>
                          <VStack align="start" gap={0}>
                            <Text fontSize="sm" fontWeight="medium">
                              {booking.turfName}
                            </Text>
                            <HStack color="gray.500">
                              <Icon as={MapPin} boxSize={3} />
                              <Text fontSize="xs">{booking.turfAddress}</Text>
                            </HStack>
                          </VStack>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack>
                            <Icon as={Calendar} boxSize={4} color="gray.400" />
                            <Text fontSize="sm">{booking.date}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack>
                            <Icon as={Clock} boxSize={4} color="gray.400" />
                            <Text fontSize="sm">{booking.time}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell fontSize="sm">
                          {booking.duration} min
                        </Table.Cell>
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
                              Book Again
                            </Button>
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ClientPastBookingsPage;
