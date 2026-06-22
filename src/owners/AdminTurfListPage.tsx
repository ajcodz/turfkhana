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
  Settings,
  AlignJustify,
  Bell,
  LogOut,
  User,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Pencil,
  Trash2,
  MapPin,
} from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import type { DashboardContext } from "./DashboardPage";
import { useOutletContext } from "react-router-dom";
import { toaster } from "../components/ui/toaster";

const APP_BASE_URL = "http://localhost:3000/api/v1";

interface Turf {
  id: number;
  ownerId: number;
  name: string;
  slug: string | null;
  type: string;
  address: string;
  openingTime: string;
  closingTime: string;
  slotDurationMinutes: number;
  pricePerSlot: number;
  currency: string;
  bookingWindowDays: number;
}

const AdminTurfListPage: React.FC = () => {
  const { onOpen } = useOutletContext<DashboardContext>();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allTurfs, setAllTurfs] = useState<Turf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const itemsPerPage = 10;

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchTurfs = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const res = await fetch(`${APP_BASE_URL}/turfs`);
        if (!res.ok) throw new Error("Failed to fetch turfs");

        const { turfs } = await res.json();

        const mappedTurfs: Turf[] = turfs.map((t: any) => ({
          id: t.id,
          ownerId: t.owner_id,
          name: t.name,
          slug: t.slug ?? null,
          type: t.type,
          address: t.address,
          openingTime: t.opening_time,
          closingTime: t.closing_time,
          slotDurationMinutes: t.slot_duration_minutes,
          pricePerSlot: t.price_per_slot,
          currency: t.currency ?? "PKR",
          bookingWindowDays: t.booking_window_days,
        }));

        mappedTurfs.sort((a, b) => b.id - a.id);
        setAllTurfs(mappedTurfs);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load turfs",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  // Edit modal state
  const [editingTurf, setEditingTurf] = useState<Turf | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    address: "",
    openingTime: "",
    closingTime: "",
    slotDurationMinutes: "",
    pricePerSlot: "",
    currency: "PKR",
    bookingWindowDays: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog state
  const [deletingTurf, setDeletingTurf] = useState<Turf | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openEditModal = (turf: Turf) => {
    setEditingTurf(turf);
    setEditForm({
      name: turf.name,
      type: turf.type,
      address: turf.address,
      openingTime: turf.openingTime,
      closingTime: turf.closingTime,
      slotDurationMinutes: String(turf.slotDurationMinutes),
      pricePerSlot: String(turf.pricePerSlot),
      currency: turf.currency,
      bookingWindowDays: String(turf.bookingWindowDays),
    });
  };

  const closeEditModal = () => setEditingTurf(null);

  const handleUpdateTurf = async () => {
    if (!editingTurf) return;
    setIsSaving(true);

    try {
      const res = await fetch(`${APP_BASE_URL}/turfs/${editingTurf.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: editingTurf.ownerId,
          name: editForm.name,
          slug: editingTurf.slug,
          type: editForm.type,
          address: editForm.address,
          lat: null,
          lng: null,
          opening_time: editForm.openingTime,
          closing_time: editForm.closingTime,
          slot_duration_minutes: parseInt(editForm.slotDurationMinutes, 10),
          price_per_slot: Number(editForm.pricePerSlot),
          currency: editForm.currency,
          booking_window_days: parseInt(editForm.bookingWindowDays, 10),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? "Failed to update turf");
      }

      const { turf: updated } = await res.json();

      setAllTurfs((prev) =>
        prev.map((t) =>
          t.id === editingTurf.id
            ? {
                ...t,
                name: updated.name,
                type: updated.type,
                address: updated.address,
                openingTime: updated.opening_time,
                closingTime: updated.closing_time,
                slotDurationMinutes: updated.slot_duration_minutes,
                pricePerSlot: updated.price_per_slot,
                currency: updated.currency,
                bookingWindowDays: updated.booking_window_days,
              }
            : t,
        ),
      );

      toaster.success({
        title: "Turf Updated",
        description: `${editingTurf.name} was updated successfully`,
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

  const handleDeleteTurf = async () => {
    if (!deletingTurf) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${APP_BASE_URL}/turfs/${deletingTurf.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? "Failed to delete turf");
      }

      setAllTurfs((prev) => prev.filter((t) => t.id !== deletingTurf.id));

      toaster.success({
        title: "Turf Deleted",
        description: `${deletingTurf.name} was deleted successfully`,
        duration: 3000,
        closable: true,
      });

      setDeletingTurf(null);
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

  const formatTime = (time: string) => {
    if (!time) return "—";
    const [hoursStr, minutes] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const meridiem = hours >= 12 ? "PM" : "AM";
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return `${String(hours).padStart(2, "0")}:${minutes} ${meridiem}`;
  };

  const filteredTurfs = allTurfs.filter((turf) => {
    const matchesSearch =
      turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      turf.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      turf.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      turf.type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTurfs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTurfs = filteredTurfs.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const uniqueTypes = [...new Set(allTurfs.map((t) => t.type))];

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
          <Text color="gray.600">Loading turfs...</Text>
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
            Failed to load turfs
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
                Turfs
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Manage all registered turfs
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

      {/* Turfs Content */}
      <Container maxW="container.xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Filters and Search */}
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
              <InputGroup
                startElement={
                  <Icon pointerEvents="none" as={Search} color="gray.400" />
                }
                maxW={{ base: "100%", md: "400px" }}
                flex={1}
              >
                <Input
                  placeholder="Search by name, address, or type..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  size="lg"
                />
              </InputGroup>

              <HStack gap={3}>
                <Icon
                  as={Filter}
                  color="gray.500"
                  display={{ base: "none", md: "block" }}
                />
                <NativeSelect.Root size="lg" maxW="200px">
                  <NativeSelect.Field
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Types</option>
                    {uniqueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </HStack>
            </Flex>

            <Text fontSize="sm" color="gray.600" mt={4}>
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredTurfs.length)} of{" "}
              {filteredTurfs.length} turfs
            </Text>
          </Box>

          {/* Turfs Table */}
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
                    <Table.ColumnHeader>Turf</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Address</Table.ColumnHeader>
                    <Table.ColumnHeader>Hours</Table.ColumnHeader>
                    <Table.ColumnHeader>Slot</Table.ColumnHeader>
                    <Table.ColumnHeader>Price</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentTurfs.length > 0 ? (
                    currentTurfs.map((turf) => (
                      <Table.Row
                        key={turf.id}
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.700"),
                        }}
                      >
                        <Table.Cell>
                          <HStack>
                            <Avatar.Root size="sm" bg="green.500">
                              <Avatar.Fallback name={turf.name} />
                            </Avatar.Root>
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {turf.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                ID: {turf.id}
                              </Text>
                            </Box>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            colorScheme="green"
                            px={3}
                            py={1}
                            borderRadius="full"
                            textTransform="capitalize"
                          >
                            {turf.type}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell fontSize="sm">
                          <HStack>
                            <Icon as={MapPin} boxSize={4} color="gray.400" />
                            <Text>{turf.address}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell fontSize="sm">
                          {formatTime(turf.openingTime)} —{" "}
                          {formatTime(turf.closingTime)}
                        </Table.Cell>
                        <Table.Cell fontSize="sm">
                          {turf.slotDurationMinutes} min
                        </Table.Cell>
                        <Table.Cell fontWeight="semibold" fontSize="sm">
                          {turf.currency} {turf.pricePerSlot.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                          <HStack gap={1}>
                            <IconButton
                              aria-label="Edit turf"
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => openEditModal(turf)}
                            >
                              <Pencil size={16} />
                            </IconButton>
                            <IconButton
                              aria-label="Delete turf"
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => setDeletingTurf(turf)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={7} textAlign="center" py={8}>
                        <VStack gap={2}>
                          <Icon as={MapPin} boxSize={12} color="gray.300" />
                          <Text color="gray.500">No turfs found</Text>
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
          {filteredTurfs.length > itemsPerPage && (
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

      {/* Edit Turf Dialog */}
      <Dialog.Root
        open={!!editingTurf}
        onOpenChange={(e) => !e.open && closeEditModal()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Turf — {editingTurf?.name}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Field.Root>
                    <Field.Label>Turf Name</Field.Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </Field.Root>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Type</Field.Label>
                      <Input
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Currency</Field.Label>
                      <Input
                        value={editForm.currency}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            currency: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                  </HStack>

                  <Field.Root>
                    <Field.Label>Address</Field.Label>
                    <Input
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                    />
                  </Field.Root>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Opening Time</Field.Label>
                      <Input
                        type="time"
                        value={editForm.openingTime}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            openingTime: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Closing Time</Field.Label>
                      <Input
                        type="time"
                        value={editForm.closingTime}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            closingTime: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                  </HStack>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Slot Duration (minutes)</Field.Label>
                      <Input
                        type="number"
                        value={editForm.slotDurationMinutes}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            slotDurationMinutes: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Price Per Slot</Field.Label>
                      <Input
                        type="number"
                        value={editForm.pricePerSlot}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            pricePerSlot: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                  </HStack>

                  <Field.Root>
                    <Field.Label>Booking Window (days)</Field.Label>
                    <Input
                      type="number"
                      value={editForm.bookingWindowDays}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          bookingWindowDays: e.target.value,
                        })
                      }
                    />
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleUpdateTurf}
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root
        open={!!deletingTurf}
        onOpenChange={(e) => !e.open && setDeletingTurf(null)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete Turf</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Are you sure you want to delete{" "}
                  <strong>{deletingTurf?.name}</strong>? This will permanently
                  remove the turf and cannot be undone.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setDeletingTurf(null)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteTurf}
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

export default AdminTurfListPage;
