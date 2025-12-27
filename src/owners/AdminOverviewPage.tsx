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
  User,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import type { DashboardContext } from "./DashboardPage";

interface Booking {
  id: string;
  customerName: string;
  turfName: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  amount: number;
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
  const { onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const stats: StatCard[] = [
    {
      title: "Today's Bookings",
      value: "12",
      icon: BookOpen,
      change: "+3 from yesterday",
      isPositive: true,
      color: "blue",
    },
    {
      title: "Upcoming Bookings",
      value: "48",
      icon: Clock,
      change: "+12% this week",
      isPositive: true,
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: "Rs 125,000",
      icon: DollarSign,
      change: "+18% this month",
      isPositive: true,
      color: "green",
    },
    {
      title: "Growth Rate",
      value: "23%",
      icon: TrendingUp,
      change: "+5% from last month",
      isPositive: true,
      color: "purple",
    },
  ];

  const recentBookings: Booking[] = [
    {
      id: "TK-2025-1542",
      customerName: "Ahmad Hassan",
      turfName: "Premier Cricket Ground",
      date: "Dec 4, 2025",
      time: "06:00 PM",
      status: "confirmed",
      amount: 2500,
    },
    {
      id: "TK-2025-1543",
      customerName: "Ali Raza",
      turfName: "Elite Futsal Arena",
      date: "Dec 4, 2025",
      time: "07:00 PM",
      status: "pending",
      amount: 3000,
    },
    {
      id: "TK-2025-1544",
      customerName: "Usman Malik",
      turfName: "Valley Cricket Pitch",
      date: "Dec 3, 2025",
      time: "05:00 PM",
      status: "completed",
      amount: 2000,
    },
    {
      id: "TK-2025-1545",
      customerName: "Hassan Khan",
      turfName: "Champions Futsal Court",
      date: "Dec 5, 2025",
      time: "08:00 PM",
      status: "confirmed",
      amount: 2800,
    },
    {
      id: "TK-2025-1546",
      customerName: "Bilal Ahmed",
      turfName: "Premier Cricket Ground",
      date: "Dec 2, 2025",
      time: "04:00 PM",
      status: "cancelled",
      amount: 2500,
    },
  ];

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
              <Text fontSize="sm" color="gray.500">
                Welcome back, Admin
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
                <Text fontSize="sm" color="gray.600" mb={1}>
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
                  <Text fontSize="xs" color="gray.500">
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
                  <Text fontSize="sm" color="gray.500">
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
                        <Text color="gray.500" fontSize="xs">
                          {booking.time}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          colorScheme={getStatusColor(booking.status)}
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
