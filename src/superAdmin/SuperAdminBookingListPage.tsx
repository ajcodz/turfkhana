import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Table,
  Badge,
  Spinner,
  Flex,
  Alert,
  Input,
  InputGroup,
  Icon,
  NativeSelect,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";

const APP_BASE_URL = "http://localhost:3000/api/v1";

interface BookingRow {
  id: number;
  clientName: string;
  clientPhone: string;
  turfName: string;
  ownerName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  paymentStatus: string;
}

const formatTime = (time: string) => {
  if (!time) return "—";
  const [hoursStr, minutes] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  const meridiem = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${meridiem}`;
};

const statusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "green";
    case "cancelled":
      return "red";
    case "pending":
      return "orange";
    default:
      return "gray";
  }
};

const SuperAdminBookingListPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(`${APP_BASE_URL}/bookings/admin/all`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const { bookings: data } = await res.json();

        setBookings(
          data.map((b: any) => ({
            id: b.id,
            clientName: b.client_name,
            clientPhone: b.client_phone,
            turfName: b.turf_name,
            ownerName: b.owner_name,
            date: b.date,
            startTime: b.start_time,
            endTime: b.end_time,
            price: b.price,
            status: b.status ?? "unknown",
            paymentStatus: b.payment_status ?? "unknown",
          })),
        );
      } catch {
        setIsError(true);
        toaster.error({
          title: "Failed to load bookings",
          description: "Please try refreshing the page.",
          duration: 4000,
          closable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      b.clientName.toLowerCase().includes(query) ||
      b.turfName.toLowerCase().includes(query) ||
      b.ownerName.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || b.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = [
    ...new Set(bookings.map((b) => b.status.toLowerCase())),
  ];

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" p={8}>
        <Alert.Root status="error" borderRadius="lg" maxW="md">
          <Alert.Description>
            Failed to load bookings. Please try again later.
          </Alert.Description>
        </Alert.Root>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Box mb={6}>
        <Heading size="lg">Bookings</Heading>
        <Text color="gray.600" mt={1}>
          {filteredBookings.length} of {bookings.length} booking
          {bookings.length !== 1 ? "s" : ""} across the platform
        </Text>
      </Box>

      <Box
        bg={cardBg}
        p={4}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        mb={4}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          align={{ base: "stretch", md: "center" }}
        >
          <InputGroup
            startElement={<Icon as={Search} color="gray.400" />}
            flex={1}
          >
            <Input
              placeholder="Search by client, turf, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <NativeSelect.Root maxW={{ base: "100%", md: "200px" }}>
            <NativeSelect.Field
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Flex>
      </Box>

      <Box
        bg={cardBg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        overflowX="auto"
      >
        <Table.Root size="md">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Client</Table.ColumnHeader>
              <Table.ColumnHeader>Turf</Table.ColumnHeader>
              <Table.ColumnHeader>Owner</Table.ColumnHeader>
              <Table.ColumnHeader>Date & Time</Table.ColumnHeader>
              <Table.ColumnHeader>Price</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Payment</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredBookings.map((b) => (
              <Table.Row key={b.id}>
                <Table.Cell>
                  <Text fontWeight="medium">{b.clientName}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {b.clientPhone}
                  </Text>
                </Table.Cell>
                <Table.Cell>{b.turfName}</Table.Cell>
                <Table.Cell>{b.ownerName}</Table.Cell>
                <Table.Cell fontSize="sm">
                  {b.date}
                  <Text fontSize="xs" color="gray.500">
                    {formatTime(b.startTime)} – {formatTime(b.endTime)}
                  </Text>
                </Table.Cell>
                <Table.Cell fontWeight="semibold" fontSize="sm">
                  {b.price.toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={statusColor(b.status)}>{b.status}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={b.paymentStatus === "paid" ? "green" : "gray"}
                  >
                    {b.paymentStatus}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
            {filteredBookings.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={7}>
                  <Text textAlign="center" color="gray.500" py={6}>
                    No bookings found.
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};

export default SuperAdminBookingListPage;
