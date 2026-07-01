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
  Text,
  VStack,
  Avatar,
  Menu,
  Input,
  Portal,
  Field,
  Spinner,
  Table,
  Badge,
  NativeSelect,
  Dialog,
} from "@chakra-ui/react";
import {
  Settings,
  AlignJustify,
  Bell,
  LogOut,
  User,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";
import { toaster } from "../components/ui/toaster";
import { useColorModeValue } from "../components/ui/color-mode";
import type { DashboardContext } from "./DashboardPage";
import { useOutletContext } from "react-router-dom";

const APP_BASE_URL = "http://localhost:3000/api/v1";

interface ClosedHour {
  id: number;
  turfId: number;
  blockedDate: string;
  blockedStartTime: string | null;
  blockedEndTime: string | null;
}

const AdminSettingsPage: React.FC = () => {
  const { onOpen } = useOutletContext<DashboardContext>();

  const owner = JSON.parse(localStorage.getItem("owner") ?? "{}");
  const ownerId = owner?.id ?? null;

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Turfs state
  const [ownerTurfs, setOwnerTurfs] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedTurfId, setSelectedTurfId] = useState<string>("");

  // Closed hours state
  const [closedHours, setClosedHours] = useState<ClosedHour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Add closed hour form state
  const [isCreatingHour, setIsCreatingHour] = useState(false);

  const closeCreateHourModal = () => {
    setIsCreatingHour(false);
    setAddForm({ blockedDate: "", blockedStartTime: "", blockedEndTime: "" });
  };
  const [addForm, setAddForm] = useState({
    blockedDate: "",
    blockedStartTime: "",
    blockedEndTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch turfs and settings on load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const [turfsRes, settingsRes] = await Promise.all([
          fetch(`${APP_BASE_URL}/turfs`),
          fetch(`${APP_BASE_URL}/settings`),
        ]);

        if (!turfsRes.ok) throw new Error("Failed to fetch turfs");
        if (!settingsRes.ok) throw new Error("Failed to fetch settings");

        const { turfs } = await turfsRes.json();
        const { settings } = await settingsRes.json();

        const filtered = turfs.filter((t: any) => t.owner_id === ownerId);
        setOwnerTurfs(filtered.map((t: any) => ({ id: t.id, name: t.name })));

        if (filtered.length > 0) {
          setSelectedTurfId(String(filtered[0].id));
        }

        const ownerTurfIds = new Set(filtered.map((t: any) => t.id));
        const now = new Date();

        const validSettings: ClosedHour[] = [];
        const expiredIds: number[] = [];

        settings.forEach((s: any) => {
          if (!ownerTurfIds.has(s.turf_id)) return;

          // Strip timezone offset from time — take only HH:MM:SS part
          const cleanEndTime = (s.blocked_end_time ?? "23:59:59").substring(
            0,
            8,
          );
          const cleanDate = s.blocked_date; // already YYYY-MM-DD

          const endDateTime = new Date(`${cleanDate}T${cleanEndTime}`);

          if (endDateTime < now) {
            expiredIds.push(s.id);
          } else {
            validSettings.push({
              id: s.id,
              turfId: s.turf_id,
              blockedDate: cleanDate,
              blockedStartTime: (s.blocked_start_time ?? "").substring(0, 8),
              blockedEndTime: cleanEndTime,
            });
          }
        });

        if (expiredIds.length > 0) {
          await Promise.all(
            expiredIds.map((id) =>
              fetch(`${APP_BASE_URL}/settings/${id}`, { method: "DELETE" }),
            ),
          );
        }

        setClosedHours(validSettings);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load settings",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setClosedHours((prev) => {
        const expired = prev.filter((s) => {
          const cleanEndTime = (s.blockedEndTime ?? "23:59:59").substring(0, 8);
          const endDateTime = new Date(`${s.blockedDate}T${cleanEndTime}`);
          return endDateTime < now;
        });

        if (expired.length > 0) {
          // Delete expired ones from DB
          expired.forEach((s) => {
            fetch(`${APP_BASE_URL}/settings/${s.id}`, { method: "DELETE" });
          });

          // Return only non-expired ones
          return prev.filter((s) => {
            const cleanEndTime = (s.blockedEndTime ?? "23:59:59").substring(
              0,
              8,
            );
            const endDateTime = new Date(`${s.blockedDate}T${cleanEndTime}`);
            return endDateTime >= now;
          });
        }

        return prev;
      });
    }, 1000); // every second

    return () => clearInterval(interval);
  }, []);

  const handleAddClosedHour = async () => {
    if (
      !selectedTurfId ||
      !addForm.blockedDate ||
      !addForm.blockedStartTime ||
      !addForm.blockedEndTime
    ) {
      toaster.error({
        title: "Validation Error",
        description: "Please fill in all required fields",
        duration: 3000,
        closable: true,
      });
      return;
    }

    if (addForm.blockedStartTime >= addForm.blockedEndTime) {
      toaster.error({
        title: "Validation Error",
        description: "End time must be after start time",
        duration: 3000,
        closable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${APP_BASE_URL}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turf_id: Number(selectedTurfId),
          blocked_date: addForm.blockedDate,
          blocked_start_time: addForm.blockedStartTime,
          blocked_end_time: addForm.blockedEndTime,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? "Failed to add closed hour");
      }

      const { setting: created } = await res.json();

      const newClosedHour: ClosedHour = {
        id: created.id,
        turfId: created.turf_id,
        blockedDate: created.blocked_date,
        blockedStartTime: created.blocked_start_time,
        blockedEndTime: created.blocked_end_time,
      };

      setClosedHours((prev) => [...prev, newClosedHour]);

      toaster.success({
        title: "Closed Hour Added",
        description: "The closed hour has been saved successfully",
        duration: 3000,
        closable: true,
      });

      closeCreateHourModal();
    } catch (error) {
      toaster.error({
        title: "Failed to Add",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClosedHour = async (id: number) => {
    setDeletingId(id);

    try {
      const res = await fetch(`${APP_BASE_URL}/settings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? "Failed to delete closed hour");
      }

      setClosedHours((prev) => prev.filter((s) => s.id !== id));

      toaster.success({
        title: "Deleted",
        description: "Closed hour removed successfully",
        duration: 3000,
        closable: true,
      });
    } catch (error) {
      toaster.error({
        title: "Delete Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        duration: 5000,
        closable: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (time: string | null) => {
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

  // Filter closed hours by selected turf
  const filteredClosedHours = closedHours.filter(
    (s) => String(s.turfId) === selectedTurfId,
  );

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
          <Text color="gray.600">Loading settings...</Text>
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
            Failed to load settings
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
                Settings
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Manage closed hours for your turfs
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
                    <Avatar.Fallback name={owner?.name ?? "Admin"} />
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

      {/* Settings Content */}
      <Container maxW="container.lg" py={8}>
        <VStack gap={6} align="stretch">
          {/* Turf Selector */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <VStack gap={4} align="stretch">
              <HStack gap={3}>
                <Icon as={Calendar} color="green.500" boxSize={6} />
                <Box>
                  <Heading as="h2" size="md">
                    Select Turf
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Choose a turf to manage its closed hours
                  </Text>
                </Box>
              </HStack>

              {ownerTurfs.length === 0 ? (
                <Text color="gray.500" fontSize="sm">
                  No turfs found. Please add a turf first.
                </Text>
              ) : (
                <NativeSelect.Root size="lg" maxW="400px">
                  <NativeSelect.Field
                    value={selectedTurfId}
                    onChange={(e) => {
                      setSelectedTurfId(e.target.value);
                    }}
                  >
                    {ownerTurfs.map((turf) => (
                      <option key={turf.id} value={turf.id}>
                        {turf.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              )}
            </VStack>
          </Box>

          {/* Closed Hours Section */}
          {selectedTurfId && (
            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="sm"
            >
              <VStack gap={6} align="stretch">
                <Flex justify="space-between" align="center">
                  <HStack gap={3}>
                    <Icon as={Calendar} color="red.500" boxSize={6} />
                    <Box>
                      <Heading as="h2" size="md">
                        Closed Hours
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        Upcoming closed periods for{" "}
                        {
                          ownerTurfs.find(
                            (t) => String(t.id) === selectedTurfId,
                          )?.name
                        }
                      </Text>
                    </Box>
                  </HStack>
                  <Button
                    colorScheme="green"
                    size="sm"
                    borderRadius="full"
                    onClick={() => setIsCreatingHour(true)}
                  >
                    <Plus size={16} />
                    Add Closed Hour
                  </Button>
                </Flex>

                {/* Closed Hours Table */}
                {filteredClosedHours.length === 0 ? (
                  <Box
                    p={8}
                    textAlign="center"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderStyle="dashed"
                  >
                    <Icon as={Calendar} boxSize={10} color="gray.300" mb={3} />
                    <Text color="gray.500" fontWeight="medium">
                      No closed hours scheduled
                    </Text>
                    <Text fontSize="sm" color="gray.400" mt={1}>
                      Click "Add Closed Hour" to schedule maintenance or
                      closures
                    </Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table.Root>
                      <Table.Header
                        bg={useColorModeValue("gray.50", "gray.700")}
                      >
                        <Table.Row>
                          <Table.ColumnHeader>Date</Table.ColumnHeader>
                          <Table.ColumnHeader>Start Time</Table.ColumnHeader>
                          <Table.ColumnHeader>End Time</Table.ColumnHeader>
                          <Table.ColumnHeader>Status</Table.ColumnHeader>
                          <Table.ColumnHeader>Action</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {filteredClosedHours.map((s) => {
                          const startDateTime = new Date(
                            `${s.blockedDate}T${s.blockedStartTime ?? "00:00:00"}`,
                          );
                          const isToday =
                            new Date(
                              s.blockedDate + "T00:00:00",
                            ).toDateString() === new Date().toDateString();
                          const isUpcoming = startDateTime > new Date();

                          return (
                            <Table.Row key={s.id}>
                              <Table.Cell fontWeight="medium">
                                {formatDate(s.blockedDate)}
                              </Table.Cell>
                              <Table.Cell>
                                {formatTime(s.blockedStartTime)}
                              </Table.Cell>
                              <Table.Cell>
                                {formatTime(s.blockedEndTime)}
                              </Table.Cell>
                              <Table.Cell>
                                <Badge
                                  colorScheme={
                                    isToday
                                      ? "orange"
                                      : isUpcoming
                                        ? "green"
                                        : "gray"
                                  }
                                  borderRadius="full"
                                  px={3}
                                  py={1}
                                >
                                  {isToday
                                    ? "Today"
                                    : isUpcoming
                                      ? "Upcoming"
                                      : "Active"}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <IconButton
                                  aria-label="Delete closed hour"
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  loading={deletingId === s.id}
                                  onClick={() => handleDeleteClosedHour(s.id)}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Table.Cell>
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
      {/* Add Closed Hour Dialog */}
      <Dialog.Root
        open={isCreatingHour}
        onOpenChange={(e) => !e.open && closeCreateHourModal()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Add Closed Hour</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Field.Root>
                    <Field.Label>Date *</Field.Label>
                    <Input
                      type="date"
                      value={addForm.blockedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setAddForm({ ...addForm, blockedDate: e.target.value })
                      }
                    />
                  </Field.Root>

                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Start Time *</Field.Label>
                      <Input
                        type="time"
                        value={addForm.blockedStartTime}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            blockedStartTime: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>End Time *</Field.Label>
                      <Input
                        type="time"
                        value={addForm.blockedEndTime}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            blockedEndTime: e.target.value,
                          })
                        }
                      />
                    </Field.Root>
                  </HStack>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={closeCreateHourModal}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleAddClosedHour}
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default AdminSettingsPage;
