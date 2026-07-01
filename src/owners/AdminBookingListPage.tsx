import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Text,
  VStack,
  Avatar,
  Badge,
  Table,
  Menu,
  Portal,
  NativeSelect,
  Spinner,
  Dialog,
  Field,
} from "@chakra-ui/react";
import {
  BookOpen,
  Settings,
  AlignJustify,
  Bell,
  LogOut,
  User,
  ChevronRight,
  Search,
  ChevronLeft,
  Filter,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import type { DashboardContext } from "./DashboardPage";
import { useOutletContext } from "react-router-dom";
import { toaster } from "../components/ui/toaster";

const APP_BASE_URL = "http://localhost:3000/api/v1";

interface Booking {
  id: string;
  rawId: number;
  clientId: number;
  turfId: number;
  customerName: string;
  customerPhone: string;
  turfName: string;
  date: string;
  rawDate: string;
  time: string;
  rawStartTime: string;
  rawEndTime: string;
  durationMinutes: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  amount: number;
}

const AdminBookingListPage: React.FC = () => {
  const { onOpen } = useOutletContext<DashboardContext>();
  const owner = JSON.parse(localStorage.getItem("owner") ?? "{}");
  const ownerId = owner?.id ?? null;
  const [ownerTurfsList, setOwnerTurfsList] = useState<
    { id: number; name: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const itemsPerPage = 10;

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const [bookingsRes, clientsRes, turfsRes] = await Promise.all([
          fetch(`${APP_BASE_URL}/bookings`),
          fetch(`${APP_BASE_URL}/clients`),
          fetch(`${APP_BASE_URL}/turfs`),
        ]);

        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        if (!clientsRes.ok) throw new Error("Failed to fetch clients");
        if (!turfsRes.ok) throw new Error("Failed to fetch turfs");

        const { bookings } = await bookingsRes.json();
        const { clients } = await clientsRes.json();
        const { turfs } = await turfsRes.json();

        const clientMap = new Map(clients.map((c: any) => [c.id, c]));

        // Only keep turfs that belong to the logged-in owner
        const ownerTurfs = turfs.filter((t: any) => t.owner_id === ownerId);
        const ownerTurfIds = new Set(ownerTurfs.map((t: any) => t.id));
        const turfMap = new Map(ownerTurfs.map((t: any) => [t.id, t]));
        setOwnerTurfsList(
          ownerTurfs.map((t: any) => ({ id: t.id, name: t.name })),
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

        const formatDate = (dateStr: string) => {
          if (!dateStr) return "—";
          return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        };

        // Only keep bookings for this owner's turfs
        const ownerBookings = bookings.filter((b: any) =>
          ownerTurfIds.has(b.turf_id),
        );

        const mappedBookings: Booking[] = ownerBookings.map((b: any) => {
          const client = clientMap.get(b.client_id) as any;
          const turf = turfMap.get(b.turf_id) as any;

          return {
            id: `TK-${b.id}`,
            rawId: b.id,
            clientId: b.client_id,
            turfId: b.turf_id,
            customerName: client?.name ?? "Unknown Customer",
            customerPhone: client?.phone ?? "—",
            turfName: turf?.name ?? "Unknown Turf",
            date: formatDate(b.date),
            rawDate: b.date,
            time: formatTime(b.start_time),
            rawStartTime: b.start_time,
            rawEndTime: b.end_time,
            durationMinutes: b.duration_minutes,
            status: (b.status ?? "pending") as Booking["status"],
            amount: b.price ?? 0,
          };
        });

        // Most recent bookings first
        mappedBookings.sort((a, b) => b.rawId - a.rawId);

        setAllBookings(mappedBookings);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load bookings",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Edit modal state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    durationMinutes: "",
    price: "",
    status: "pending",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog state
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);

  // Create modal state
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    turfId: "",
    date: "",
    startTime: "",
    endTime: "",
    durationMinutes: "60",
    price: "",
    status: "confirmed",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeCreateModal = () => {
    setIsCreating(false);
    setCreateForm({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      turfId: "",
      date: "",
      startTime: "",
      endTime: "",
      durationMinutes: "60",
      price: "",
      status: "confirmed",
    });
  };

  const handleCreateBooking = async () => {
    if (
      !createForm.customerName ||
      !createForm.customerPhone ||
      !createForm.turfId ||
      !createForm.date ||
      !createForm.startTime ||
      !createForm.endTime ||
      !createForm.price
    ) {
      toaster.error({
        title: "Validation Error",
        description: "Please fill in all required fields",
        duration: 3000,
        closable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create the client
      const clientRes = await fetch(`${APP_BASE_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.customerName.trim(),
          phone: createForm.customerPhone.trim(),
          email: createForm.customerEmail.trim() || null,
        }),
      });

      if (!clientRes.ok) {
        const err = await clientRes.json();
        throw new Error(err?.error?.message ?? "Failed to create client");
      }

      const { client } = await clientRes.json();

      // Step 2: Create the booking
      const bookingRes = await fetch(`${APP_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: client.id,
          turf_id: Number(createForm.turfId),
          date: createForm.date,
          start_time: createForm.startTime,
          end_time: createForm.endTime,
          duration_minutes: parseInt(createForm.durationMinutes, 10),
          price: Number(createForm.price),
          status: createForm.status,
          payment_method: "cash",
          payment_status: "pending",
          payment_transaction_id: null,
        }),
      });

      if (!bookingRes.ok) {
        const err = await bookingRes.json();
        throw new Error(err?.error?.message ?? "Failed to create booking");
      }

      const { booking: created } = await bookingRes.json();

      const turf = ownerTurfsList.find(
        (t) => t.id === Number(createForm.turfId),
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

      const newBooking: Booking = {
        id: `TK-${created.id}`,
        rawId: created.id,
        clientId: client.id,
        turfId: Number(createForm.turfId),
        customerName: client.name,
        customerPhone: client.phone,
        turfName: turf?.name ?? "Unknown Turf",
        date: new Date(created.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        rawDate: created.date,
        time: formatTime(created.start_time),
        rawStartTime: created.start_time,
        rawEndTime: created.end_time,
        durationMinutes: created.duration_minutes,
        status: created.status,
        amount: created.price,
      };

      setAllBookings((prev) => [newBooking, ...prev]);

      toaster.success({
        title: "Booking Created",
        description: `Booking for ${client.name} was created successfully`,
        duration: 3000,
        closable: true,
      });

      closeCreateModal();
    } catch (error) {
      toaster.error({
        title: "Create Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const openEditModal = (booking: Booking) => {
    setEditingBooking(booking);
    setEditForm({
      date: booking.rawDate,
      startTime: booking.rawStartTime,
      endTime: booking.rawEndTime,
      durationMinutes: String(booking.durationMinutes ?? ""),
      price: String(booking.amount ?? ""),
      status: booking.status,
    });
  };

  const closeEditModal = () => {
    setEditingBooking(null);
  };

  const handleUpdateBooking = async () => {
    if (!editingBooking) return;
    setIsSaving(true);

    try {
      const res = await fetch(
        `${APP_BASE_URL}/bookings/${editingBooking.rawId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: editingBooking.clientId,
            turf_id: editingBooking.turfId,
            date: editForm.date,
            start_time: editForm.startTime,
            end_time: editForm.endTime,
            duration_minutes: parseInt(editForm.durationMinutes, 10),
            price: Number(editForm.price),
            status: editForm.status,
            payment_method: null,
            payment_status: null,
            payment_transaction_id: null,
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? "Failed to update booking");
      }

      const { booking: updated } = await res.json();

      // Update local state without refetching everything
      setAllBookings((prev) =>
        prev.map((b) =>
          b.rawId === editingBooking.rawId
            ? {
                ...b,
                rawDate: updated.date,
                date: new Date(updated.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                rawStartTime: updated.start_time,
                rawEndTime: updated.end_time,
                time: (() => {
                  const [hoursStr, minutes] = updated.start_time.split(":");
                  let hours = parseInt(hoursStr, 10);
                  const meridiem = hours >= 12 ? "PM" : "AM";
                  if (hours === 0) hours = 12;
                  else if (hours > 12) hours -= 12;
                  return `${String(hours).padStart(2, "0")}:${minutes} ${meridiem}`;
                })(),
                durationMinutes: updated.duration_minutes,
                amount: updated.price,
                status: updated.status,
              }
            : b,
        ),
      );

      toaster.success({
        title: "Booking Updated",
        description: `Booking ${editingBooking.id} was updated successfully`,
        duration: 3000,
        closable: true,
      });

      closeEditModal();
    } catch (error) {
      toaster.error({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!deletingBooking) return;
    setIsDeleting(true);

    try {
      const res = await fetch(
        `${APP_BASE_URL}/bookings/${deletingBooking.rawId}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? "Failed to delete booking");
      }

      setAllBookings((prev) =>
        prev.filter((b) => b.rawId !== deletingBooking.rawId),
      );

      toaster.success({
        title: "Booking Deleted",
        description: `Booking ${deletingBooking.id} was deleted successfully`,
        duration: 3000,
        closable: true,
      });

      setDeletingBooking(null);
    } catch (error) {
      toaster.error({
        title: "Delete Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsDeleting(false);
    }
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

  // Filter bookings based on search and status
  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.turfName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
          <Text color="gray.600">Loading bookings...</Text>
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
                Bookings
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Manage all turf bookings
              </Text>
            </Box>
          </HStack>

          <HStack gap={3}>
            <Button
              colorScheme="green"
              size="sm"
              borderRadius="full"
              onClick={() => setIsCreating(true)}
            >
              <Plus size={16} />
              New Booking
            </Button>

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

      {/* Bookings Content */}
      <Container maxW="container.xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Filters and Search Bar */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              align={{ base: "stretch", md: "center" }}
              justify="space-between"
            >
              {/* Search Bar */}
              <InputGroup
                startElement={
                  <Icon pointerEvents="none" as={Search} color="gray.400" />
                }
                maxW={{ base: "100%", md: "400px" }}
                flex={1}
              >
                <Input
                  placeholder="Search by booking ID, customer name, or turf..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  size="lg"
                />
              </InputGroup>

              {/* Status Filter */}
              <HStack gap={3}>
                <Icon
                  as={Filter}
                  color="gray.500"
                  display={{ base: "none", md: "block" }}
                />
                <NativeSelect.Root size="lg" maxW="200px">
                  <NativeSelect.Field
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </HStack>
            </Flex>

            {/* Results Count */}
            <Text fontSize="sm" color="gray.600" mt={4}>
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredBookings.length)} of{" "}
              {filteredBookings.length} bookings
            </Text>
          </Box>

          {/* Bookings Table */}
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
                    <Table.ColumnHeader>Customer</Table.ColumnHeader>
                    <Table.ColumnHeader>Turf</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Time</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Amount</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentBookings.length > 0 ? (
                    currentBookings.map((booking) => (
                      <Table.Row
                        key={booking.id}
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.700"),
                        }}
                      >
                        <Table.Cell fontWeight="medium" fontSize="sm">
                          {booking.id}
                        </Table.Cell>
                        <Table.Cell>
                          <HStack>
                            <Avatar.Root size="sm" bg="green.500">
                              <Avatar.Fallback name={booking.customerName} />
                            </Avatar.Root>
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {booking.customerName}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {booking.customerPhone}
                              </Text>
                            </Box>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell fontSize="sm">
                          {booking.turfName}
                        </Table.Cell>
                        <Table.Cell fontSize="sm">{booking.date}</Table.Cell>
                        <Table.Cell fontSize="sm">{booking.time}</Table.Cell>
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
                        <Table.Cell>
                          <HStack gap={1}>
                            <IconButton
                              aria-label="Edit booking"
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => openEditModal(booking)}
                            >
                              <Pencil size={16} />
                            </IconButton>
                            <IconButton
                              aria-label="Delete booking"
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => setDeletingBooking(booking)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={8} textAlign="center" py={8}>
                        <VStack gap={2}>
                          <Icon as={BookOpen} boxSize={12} color="gray.300" />
                          <Text color="gray.500">No bookings found</Text>
                          <Text fontSize="sm" color="gray.400">
                            Try adjusting your search or filters
                          </Text>
                        </VStack>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>

          {/* Pagination */}
          {filteredBookings.length > itemsPerPage && (
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" color="gray.600">
                Page {currentPage} of {totalPages}
              </Text>
              <HStack gap={2}>
                <IconButton
                  aria-label="Previous page"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft />
                </IconButton>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1,
                  )
                  .map((page, index, array) => {
                    const elements = [];
                    if (index > 0 && array[index - 1] !== page - 1) {
                      elements.push(
                        <Text key={`ellipsis-${page}`} color="gray.500">
                          ...
                        </Text>,
                      );
                    }
                    elements.push(
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "solid" : "outline"}
                        colorScheme={currentPage === page ? "green" : "gray"}
                        size="sm"
                        minW="40px"
                      >
                        {page}
                      </Button>,
                    );
                    return elements;
                  })}
                <IconButton
                  aria-label="Next page"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight />
                </IconButton>
              </HStack>
            </Flex>
          )}
        </VStack>
      </Container>
      {/* Edit Booking Dialog */}
      <Dialog.Root
        open={!!editingBooking}
        onOpenChange={(e) => !e.open && closeEditModal()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Booking {editingBooking?.id}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Field.Root>
                    <Field.Label>Date</Field.Label>
                    <Input
                      type="date"
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, date: e.target.value })
                      }
                    />
                  </Field.Root>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Start Time</Field.Label>
                      <Input
                        type="time"
                        step={1}
                        value={editForm.startTime}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>End Time</Field.Label>
                      <Input
                        type="time"
                        step={1}
                        value={editForm.endTime}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            endTime: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                  </HStack>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Duration (minutes)</Field.Label>
                      <Input
                        type="number"
                        value={editForm.durationMinutes}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            durationMinutes: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Price (Rs)</Field.Label>
                      <Input
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                      />
                    </Field.Root>
                  </HStack>

                  <Field.Root>
                    <Field.Label>Status</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleUpdateBooking}
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Create Booking Dialog */}
      <Dialog.Root
        open={isCreating}
        onOpenChange={(e) => !e.open && closeCreateModal()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Add New Booking</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Field.Root>
                    <Field.Label>Customer Name *</Field.Label>
                    <Input
                      placeholder="e.g. Ahsan Javed"
                      value={createForm.customerName}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          customerName: e.target.value,
                        })
                      }
                    />
                  </Field.Root>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Phone Number *</Field.Label>
                      <Input
                        placeholder="03001234567"
                        value={createForm.customerPhone}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            customerPhone: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Email (optional)</Field.Label>
                      <Input
                        placeholder="customer@email.com"
                        value={createForm.customerEmail}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            customerEmail: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                  </HStack>

                  <Field.Root>
                    <Field.Label>Turf *</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={createForm.turfId}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            turfId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select a turf</option>
                        {ownerTurfsList.map((turf) => (
                          <option key={turf.id} value={turf.id}>
                            {turf.name}
                          </option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Date *</Field.Label>
                    <Input
                      type="date"
                      value={createForm.date}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, date: e.target.value })
                      }
                    />
                  </Field.Root>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Start Time *</Field.Label>
                      <Input
                        type="time"
                        step={1}
                        value={createForm.startTime}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>End Time *</Field.Label>
                      <Input
                        type="time"
                        step={1}
                        value={createForm.endTime}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            endTime: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                  </HStack>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Duration (minutes)</Field.Label>
                      <Input
                        type="number"
                        value={createForm.durationMinutes}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            durationMinutes: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Price (Rs) *</Field.Label>
                      <Input
                        type="number"
                        placeholder="e.g. 2000"
                        value={createForm.price}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            price: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                  </HStack>

                  <Field.Root>
                    <Field.Label>Status</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={createForm.status}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={closeCreateModal}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleCreateBooking}
                  loading={isSubmitting}
                >
                  Create Booking
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root
        open={!!deletingBooking}
        onOpenChange={(e) => !e.open && setDeletingBooking(null)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete Booking</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Are you sure you want to delete booking{" "}
                  <strong>{deletingBooking?.id}</strong> for{" "}
                  <strong>{deletingBooking?.customerName}</strong>? This action
                  cannot be undone.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={() => setDeletingBooking(null)}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteBooking}
                  loading={isDeleting}
                >
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default AdminBookingListPage;
