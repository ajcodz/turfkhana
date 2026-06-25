import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
  Avatar,
  Badge,
  Menu,
  Portal,
  Separator,
  Spinner,
} from "@chakra-ui/react";
import {
  CalendarDays,
  Settings,
  AlignJustify,
  Bell,
  LogOut,
  User,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { useOutletContext } from "react-router-dom";
import type { DashboardContext } from "./DashboardPage";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  turfName: string;
  time: string;
  duration: string;
  status: "confirmed" | "pending" | "completed";
  amount: number;
}

interface DayBooking {
  date: Date;
  bookings: Booking[];
}

const AdminCalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { onOpen } = useOutletContext<DashboardContext>();
  const owner = JSON.parse(localStorage.getItem("owner") ?? "{}");
  const ownerId = owner?.id ?? null;

  const [dayBookings, setDayBookings] = useState<DayBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const [bookingsRes, clientsRes, turfsRes] = await Promise.all([
          fetch("http://localhost:3000/api/v1/bookings"),
          fetch("http://localhost:3000/api/v1/clients"),
          fetch("http://localhost:3000/api/v1/turfs"),
        ]);

        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        if (!clientsRes.ok) throw new Error("Failed to fetch clients");
        if (!turfsRes.ok) throw new Error("Failed to fetch turfs");

        const { bookings } = await bookingsRes.json();
        const { clients } = await clientsRes.json();
        const { turfs } = await turfsRes.json();

        const clientMap = new Map(clients.map((c: any) => [c.id, c]));

        // Filter to only this owner's turfs
        const ownerTurfs = turfs.filter((t: any) => t.owner_id === ownerId);
        const ownerTurfIds = new Set(ownerTurfs.map((t: any) => t.id));
        const turfMap = new Map(ownerTurfs.map((t: any) => [t.id, t]));

        // Filter bookings to only this owner's turfs
        const ownerBookings = bookings.filter((b: any) =>
          ownerTurfIds.has(b.turf_id),
        );

        const formatTime = (time: string) => {
          if (!time) return "—";
          const [hoursStr, minutes] = time.split(":");
          let hours = parseInt(hoursStr, 10);
          const meridiem = hours >= 12 ? "PM" : "AM";
          if (hours === 0) hours = 12;
          else if (hours > 12) hours -= 12;
          return `${String(hours).padStart(2, "0")}:${minutes} ${meridiem}`;
        };

        // Group bookings by date
        const bookingsByDate = new Map<string, Booking[]>();

        ownerBookings.forEach((b: any) => {
          const client = clientMap.get(b.client_id) as any;
          const turf = turfMap.get(b.turf_id) as any;

          const booking: Booking = {
            id: `TK-${b.id}`,
            customerName: client?.name ?? "Unknown Customer",
            customerPhone: client?.phone ?? "—",
            turfName: turf?.name ?? "Unknown Turf",
            time: formatTime(b.start_time),
            duration: `${b.duration_minutes} min`,
            status: (b.status ?? "pending") as Booking["status"],
            amount: b.price ?? 0,
          };

          const dateKey = b.date;
          if (!bookingsByDate.has(dateKey)) {
            bookingsByDate.set(dateKey, []);
          }
          bookingsByDate.get(dateKey)!.push(booking);
        });

        // Convert to DayBooking array
        const mapped: DayBooking[] = Array.from(bookingsByDate.entries()).map(
          ([dateStr, bookings]) => ({
            date: new Date(dateStr + "T00:00:00"),
            bookings,
          }),
        );

        setDayBookings(mapped);
      } catch (error) {
        setFetchError(
          error instanceof Error
            ? error.message
            : "Failed to load calendar data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const todayBg = useColorModeValue("green.500", "green.600");
  const selectedBg = useColorModeValue("green.100", "green.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getBookingsForDate = (date: Date | null): Booking[] => {
    if (!date) return [];
    const dayBooking = dayBookings.find(
      (db) => db.date.toDateString() === date.toDateString(),
    );
    return dayBooking ? dayBooking.bookings : [];
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return isSameDay(date, new Date());
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + increment,
        1,
      ),
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "pending":
        return "yellow";
      case "completed":
        return "blue";
      default:
        return "gray";
    }
  };

  const selectedBookings = getBookingsForDate(selectedDate);

  if (isLoading) {
    return (
      <Box
        flex={1}
        ml={{ base: 0, lg: "280px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="green.500" />
          <Text color="gray.600">Loading calendar...</Text>
        </VStack>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box
        flex={1}
        ml={{ base: 0, lg: "280px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
      >
        <VStack gap={2}>
          <Text color="red.500" fontWeight="semibold">
            Failed to load calendar
          </Text>
          <Text fontSize="sm" color="gray.500">
            {fetchError}
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex={1} ml={{ base: 0, lg: "280px" }}>
      {/* Top Navbar */}
      <Box
        bg={cardBg}
        borderBottomWidth="1px"
        borderColor={borderColor}
        px={6}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex justify="space-between" align="center">
          <HStack gap={4}>
            <IconButton
              aria-label="Open menu"
              variant="ghost"
              display={{ base: "flex", lg: "none" }}
              onClick={onOpen}
            >
              <AlignJustify />
            </IconButton>
            <Box>
              <Heading as="h1" size="lg">
                Calendar
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Manage your turf bookings
              </Text>
            </Box>
          </HStack>

          <HStack gap={3}>
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              position="relative"
            >
              <Bell />
              <Box
                position="absolute"
                top={2}
                right={2}
                w={2}
                h={2}
                bg="red.500"
                borderRadius="full"
              />
            </IconButton>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Box
                  display={{ base: "none", md: "block" }}
                  textAlign="right"
                  mr={2}
                >
                  <Text fontSize="sm" fontWeight="semibold">
                    {owner?.name ?? "Admin"}
                  </Text>
                </Box>
                <Button variant="ghost">
                  <Avatar.Root size="sm" bg="green.500">
                    <Avatar.Fallback name="Admin" />
                  </Avatar.Root>
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="profile">
                      <User size={16} />
                      Profile
                    </Menu.Item>
                    <Menu.Item value="settings">
                      <Settings size={16} />
                      Settings
                    </Menu.Item>
                    <Menu.Item value="logout" color="red.500">
                      <LogOut size={16} />
                      Logout
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        </Flex>
      </Box>

      {/* Calendar Content */}
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 380px" }} gap={6}>
          {/* Calendar Grid */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <VStack gap={6} align="stretch">
              {/* Calendar Header */}
              <Flex justify="space-between" align="center">
                <Heading as="h2" size="lg">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </Heading>
                <HStack gap={2}>
                  <IconButton
                    aria-label="Previous month"
                    onClick={() => changeMonth(-1)}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft />
                  </IconButton>
                  <Button
                    onClick={() => setCurrentDate(new Date())}
                    size="sm"
                    variant="outline"
                  >
                    Today
                  </Button>
                  <IconButton
                    aria-label="Next month"
                    onClick={() => changeMonth(1)}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight />
                  </IconButton>
                </HStack>
              </Flex>

              {/* Week Days Header */}
              <Grid templateColumns="repeat(7, 1fr)" gap={2}>
                {weekDays.map((day) => (
                  <Box key={day} textAlign="center" py={2}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                      {day}
                    </Text>
                  </Box>
                ))}
              </Grid>

              {/* Calendar Days */}
              <Grid templateColumns="repeat(7, 1fr)" gap={2}>
                {getDaysInMonth(currentDate).map((date, index) => {
                  const bookings = getBookingsForDate(date);
                  const hasBookings = bookings.length > 0;
                  const isSelectedDay = isSameDay(date, selectedDate);
                  const isTodayDay = isToday(date);

                  return (
                    <Box
                      key={index}
                      position="relative"
                      aspectRatio="1"
                      bg={
                        date
                          ? isSelectedDay
                            ? selectedBg
                            : "transparent"
                          : "transparent"
                      }
                      borderRadius="lg"
                      borderWidth="2px"
                      borderColor={
                        date
                          ? isTodayDay
                            ? todayBg
                            : isSelectedDay
                              ? "green.500"
                              : "transparent"
                          : "transparent"
                      }
                      cursor={date ? "pointer" : "default"}
                      _hover={date ? { bg: hoverBg } : {}}
                      onClick={() => date && setSelectedDate(date)}
                      transition="all 0.2s"
                    >
                      {date && (
                        <VStack gap={1} p={2} h="100%" justify="flex-start">
                          <Text
                            fontSize="sm"
                            fontWeight={isTodayDay ? "bold" : "medium"}
                            color={isTodayDay ? todayBg : "gray.700"}
                          >
                            {date.getDate()}
                          </Text>
                          {hasBookings && (
                            <VStack gap={0.5} w="100%">
                              {bookings.slice(0, 2).map((booking, idx) => (
                                <Box
                                  key={idx}
                                  w="100%"
                                  h="4px"
                                  bg={`${getStatusColor(booking.status)}.400`}
                                  borderRadius="full"
                                />
                              ))}
                              {bookings.length > 2 && (
                                <Text fontSize="2xs" color="gray.500">
                                  +{bookings.length - 2}
                                </Text>
                              )}
                            </VStack>
                          )}
                        </VStack>
                      )}
                    </Box>
                  );
                })}
              </Grid>
            </VStack>
          </Box>

          {/* Side Panel - Bookings for Selected Date */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            position={{ lg: "sticky" }}
            top={{ lg: "100px" }}
            maxH={{ lg: "calc(100vh - 120px)" }}
            overflowY="auto"
          >
            <VStack gap={4} align="stretch">
              <Box>
                <Heading as="h3" size="md" mb={2}>
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a date"}
                </Heading>
                <HStack>
                  <Badge colorScheme="green" px={2} py={1}>
                    {selectedBookings.length}{" "}
                    {selectedBookings.length === 1 ? "Booking" : "Bookings"}
                  </Badge>
                </HStack>
              </Box>

              <Separator />

              {selectedBookings.length > 0 ? (
                <VStack gap={4} align="stretch">
                  {selectedBookings.map((booking) => (
                    <Box
                      key={booking.id}
                      p={4}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={borderColor}
                      transition="all 0.2s"
                      _hover={{ shadow: "md" }}
                    >
                      <VStack gap={3} align="stretch">
                        <Flex justify="space-between" align="start">
                          <HStack>
                            <Avatar.Root size="sm" bg="green.500">
                              <Avatar.Fallback name={booking.customerName} />
                            </Avatar.Root>
                            <Box>
                              <Text fontWeight="semibold" fontSize="sm">
                                {booking.customerName}
                              </Text>
                              <HStack fontSize="xs" color="gray.500">
                                <Icon as={Phone} boxSize={3} />
                                <Text>{booking.customerPhone}</Text>
                              </HStack>
                            </Box>
                          </HStack>
                          <Badge
                            colorPalette={getStatusColor(booking.status)}
                            fontSize="xs"
                          >
                            {booking.status}
                          </Badge>
                        </Flex>

                        <Separator />

                        <VStack gap={2} align="stretch" fontSize="sm">
                          <HStack>
                            <Icon as={MapPin} boxSize={4} color="gray.500" />
                            <Text>{booking.turfName}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={Clock} boxSize={4} color="gray.500" />
                              <Text>{booking.time}</Text>
                            </HStack>
                            <Text color="gray.500">{booking.duration}</Text>
                          </HStack>
                        </VStack>

                        <Separator />

                        <Flex justify="space-between" align="center">
                          <Text fontSize="xs" color="gray.500">
                            {booking.id}
                          </Text>
                          <Text fontWeight="bold" color="green.500">
                            Rs {booking.amount.toLocaleString()}
                          </Text>
                        </Flex>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <VStack gap={4} py={8}>
                  <Icon as={CalendarDays} boxSize={12} color="gray.300" />
                  <Text color="gray.500" textAlign="center">
                    No bookings for this date
                  </Text>
                </VStack>
              )}
            </VStack>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminCalendarPage;
