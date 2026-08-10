import { useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  Portal,
  Table,
  Text,
  useDisclosure,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import {
  AlignJustify,
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  DollarSign,
  LogOut,
  Settings,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import type { DashboardContext } from "./DashboardPage";
import { APP_BASE_URL } from "../utils/api";


interface Booking {
  id: string;
  rawId: number;
  customerName: string;
  turfName: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  amount: number;
  rawDate: string;
}

interface StatCard {
  title: string;
  value: string;
  icon: any;
  change: string;
  isPositive: boolean;
  color: string;
}

const AdminOverviewPage: React.FC = () => {
  const { setActiveNav, onOpen } = useOutletContext<DashboardContext>();
  const owner = JSON.parse(localStorage.getItem("owner") ?? "{}");
  const ownerId = owner?.id ?? null;
  const { onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const turfsRes = await fetch(
          `${APP_BASE_URL}/turfs?owner_id=${ownerId}`,
        );
        if (!turfsRes.ok) throw new Error("Failed to fetch turfs");
        const { turfs: ownerTurfs } = await turfsRes.json();

        const turfIds = ownerTurfs.map((t: any) => t.id).join(",");
        const bookingsUrl = turfIds
          ? `${APP_BASE_URL}/bookings?turf_ids=${turfIds}`
          : null;

        const [bookingsRes, clientsRes] = await Promise.all([
          bookingsUrl ? fetch(bookingsUrl) : Promise.resolve(null),
          fetch(`${APP_BASE_URL}/clients/mine`, { credentials: "include" }),
        ]);

        if (bookingsRes && !bookingsRes.ok)
          throw new Error("Failed to fetch bookings");
        if (!clientsRes.ok) throw new Error("Failed to fetch clients");

        const ownerBookings = bookingsRes
          ? (await bookingsRes.json()).bookings
          : [];
        const { clients } = await clientsRes.json();

        const clientMap = new Map(clients.map((c: any) => [c.id, c]));
        const turfMap = new Map(ownerTurfs.map((t: any) => [t.id, t]));

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
          if (!dateStr) return "—";
          return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        };

        const mapped: Booking[] = ownerBookings.map((b: any) => {
          const client = clientMap.get(b.client_id) as any;
          const turf = turfMap.get(b.turf_id) as any;
          return {
            id: `TK-${b.id}`,
            rawId: b.id,
            customerName: client?.name ?? "Unknown Customer",
            turfName: turf?.name ?? "Unknown Turf",
            date: formatDate(b.date),
            rawDate: b.date,
            time: formatTime(b.start_time),
            status: (b.status ?? "pending") as Booking["status"],
            amount: b.price ?? 0,
          };
        });

        mapped.sort((a, b) => b.rawId - a.rawId);
        setAllBookings(mapped.slice(0, 5));

        // --- Compute stats ---
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const todaysBookings = ownerBookings.filter(
          (b: any) => b.date === todayStr,
        ).length;

        const now = new Date();
        const upcomingBookings = ownerBookings.filter((b: any) => {
          const bookingDateTime = new Date(`${b.date}T${b.start_time}`);
          return bookingDateTime >= now && b.status !== "cancelled";
        }).length;

        const totalRevenue = ownerBookings
          .filter((b: any) => b.payment_status === "paid")
          .reduce((sum: number, b: any) => sum + (b.price ?? 0), 0);

        // Growth: this month's bookings vs last month's bookings
        const thisMonthCount = ownerBookings.filter((b: any) => {
          const d = new Date(b.date);
          return (
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          );
        }).length;

        const lastMonthDate = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        );
        const lastMonthCount = ownerBookings.filter((b: any) => {
          const d = new Date(b.date);
          return (
            d.getMonth() === lastMonthDate.getMonth() &&
            d.getFullYear() === lastMonthDate.getFullYear()
          );
        }).length;

        const growthRate =
          lastMonthCount === 0
            ? thisMonthCount > 0
              ? 100
              : 0
            : Math.round(
                ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100,
              );

        setStats([
          {
            title: "Today's Bookings",
            value: String(todaysBookings),
            icon: BookOpen,
            change: `${ownerBookings.length} total bookings`,
            isPositive: true,
            color: "blue",
          },
          {
            title: "Upcoming Bookings",
            value: String(upcomingBookings),
            icon: Clock,
            change: "Confirmed & pending",
            isPositive: true,
            color: "orange",
          },
          {
            title: "Total Revenue",
            value: `Rs ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            change: "From paid bookings",
            isPositive: true,
            color: "green",
          },
          {
            title: "Growth Rate",
            value: `${growthRate >= 0 ? "+" : ""}${growthRate}%`,
            icon: growthRate >= 0 ? TrendingUp : TrendingDown,
            change: "vs last month",
            isPositive: growthRate >= 0,
            color: "purple",
          },
        ]);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const recentBookings = allBookings;

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
          <Text color="fg.muted">Loading dashboard...</Text>
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
            Failed to load dashboard
          </Text>
          <Text fontSize="sm" color="fg.muted">
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
                Dashboard
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                Welcome back, {owner?.name ?? "Admin"}
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
                    Admin User
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

      {/* Dashboard Content */}
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Stats Cards */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                bg={cardBg}
                p={6}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
                shadow="sm"
                transition="all 0.2s"
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
              >
                <HStack justify="space-between" mb={4}>
                  <Box bg={`${stat.color}.100`} p={3} borderRadius="lg">
                    <Icon
                      as={stat.icon}
                      boxSize={6}
                      color={`${stat.color}.600`}
                    />
                  </Box>
                </HStack>
                <Text fontSize="sm" color="fg.muted" mb={1}>
                  {stat.title}
                </Text>
                <Heading as="h3" size="xl" mb={2}>
                  {stat.value}
                </Heading>
                <HStack gap={1}>
                  <Icon
                    as={TrendingUp}
                    boxSize={4}
                    color={stat.isPositive ? "green.500" : "red.500"}
                  />
                  <Text fontSize="xs" color="fg.muted">
                    {stat.change}
                  </Text>
                </HStack>
              </Box>
            ))}
          </Grid>

          {/* Recent Bookings Table */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            overflow="hidden"
          >
            <Box p={6} borderBottomWidth="1px" borderColor={borderColor}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading as="h2" size="md" mb={1}>
                    Recent Bookings
                  </Heading>
                  <Text fontSize="sm" color="fg.muted">
                    Latest booking activities
                  </Text>
                </Box>
                <Link
                  to="booking-list"
                  onClick={() => {
                    setActiveNav("Bookings");
                    onClose();
                  }}
                >
                  <Button colorScheme="green" size="sm" variant="outline">
                    View All
                    <ChevronRight size={16} />
                  </Button>
                </Link>
              </Flex>
            </Box>

            <Box overflowX="auto">
              <Table.Root size="sm">
                <Table.Header bg={useColorModeValue("gray.50", "gray.700")}>
                  <Table.Row>
                    <Table.ColumnHeader>Booking ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Customer</Table.ColumnHeader>
                    <Table.ColumnHeader>Turf</Table.ColumnHeader>
                    <Table.ColumnHeader>Date & Time</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Amount</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {recentBookings.map((booking) => (
                    <Table.Row
                      key={booking.id}
                      _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                    >
                      <Table.Cell fontWeight="medium" fontSize="sm">
                        {booking.id}
                      </Table.Cell>
                      <Table.Cell>
                        <HStack>
                          <Avatar.Root size="sm" bg="green.500">
                            <Avatar.Fallback name={booking.customerName} />
                          </Avatar.Root>
                          <Text fontSize="sm">{booking.customerName}</Text>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell fontSize="sm">{booking.turfName}</Table.Cell>
                      <Table.Cell fontSize="sm">
                        <Text>{booking.date}</Text>
                        <Text color="fg.muted" fontSize="xs">
                          {booking.time}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          colorPalette={getStatusColor(booking.status)}
                          px={3}
                          py={1}
                          borderRadius="full"
                          textTransform="capitalize"
                        >
                          {booking.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontWeight="semibold" fontSize="sm">
                        Rs {booking.amount.toLocaleString()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminOverviewPage;
