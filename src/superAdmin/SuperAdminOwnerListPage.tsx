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
  Button,
  Dialog,
  HStack,
  Portal,
  Field,
  Input,
  VStack,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";
import { Eye, EyeOff, Pencil, Trash2, Power, KeyRound } from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import { APP_BASE_URL } from "../utils/api";


interface OwnerRow {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  is_active: boolean;
  turfCount: number;
}

const SuperAdminOwnerListPage: React.FC = () => {
  const [owners, setOwners] = useState<OwnerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [createErrors, setCreateErrors] = useState<Partial<typeof createForm>>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit modal state
  const [editingOwner, setEditingOwner] = useState<OwnerRow | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [editErrors, setEditErrors] = useState<Partial<typeof editForm>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog state
  const [deletingOwner, setDeletingOwner] = useState<OwnerRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status toggle state (tracks which row is mid-request, to disable just that button)
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const [resettingOwner, setResettingOwner] = useState<OwnerRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const closeResetModal = () => {
    setResettingOwner(null);
    setNewPassword("");
    setResetError("");
  };

  const handleResetPassword = async () => {
    if (!resettingOwner) return;

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch(
        `${APP_BASE_URL}/owners/${resettingOwner.id}/reset-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ password: newPassword }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : (data?.error?.message ?? "Failed to reset password"),
        );
      }

      toaster.success({
        title: "Password Reset",
        description: `${resettingOwner.name}'s password has been reset. Share the new password with them securely.`,
        duration: 5000,
        closable: true,
      });

      closeResetModal();
    } catch (error) {
      toaster.error({
        title: "Reset Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const closeCreateModal = () => {
    setIsCreating(false);
    setCreateForm({ name: "", email: "", phone: "", password: "" });
    setCreateErrors({});
  };

  const validateCreateForm = (): boolean => {
    const errors: Partial<typeof createForm> = {};

    if (!createForm.name.trim()) errors.name = "Name is required";

    if (!createForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^03[0-9]{9}$/.test(createForm.phone.replace(/\s|-/g, ""))) {
      errors.phone = "Please enter a valid Pakistani phone number";
    }

    if (!createForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!createForm.password) {
      errors.password = "Password is required";
    } else if (createForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateOwner = async () => {
    if (!validateCreateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${APP_BASE_URL}/owners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: createForm.name.trim(),
          email: createForm.email.trim(),
          phone: createForm.phone.trim(),
          password: createForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Failed to create owner");
      }

      setOwners((prev) => [
        {
          id: data.owner.id,
          name: data.owner.name,
          email: data.owner.email,
          phone: data.owner.phone,
          is_active: data.owner.is_active ?? true,
          turfCount: 0,
        },
        ...prev,
      ]);

      toaster.success({
        title: "Owner Created",
        description: `${data.owner.name}'s account has been created.`,
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

  const openEditModal = (owner: OwnerRow) => {
    setEditingOwner(owner);
    setEditForm({
      name: owner.name,
      email: owner.email ?? "",
      phone: owner.phone,
    });
    setEditErrors({});
  };

  const closeEditModal = () => setEditingOwner(null);

  const validateEditForm = (): boolean => {
    const errors: Partial<typeof editForm> = {};

    if (!editForm.name.trim()) errors.name = "Name is required";

    if (!editForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^03[0-9]{9}$/.test(editForm.phone.replace(/\s|-/g, ""))) {
      errors.phone = "Please enter a valid Pakistani phone number";
    }

    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateOwner = async () => {
    if (!editingOwner || !validateEditForm()) return;
    setIsSaving(true);

    try {
      const res = await fetch(`${APP_BASE_URL}/owners/${editingOwner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim() || null,
          phone: editForm.phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Failed to update owner");
      }

      setOwners((prev) =>
        prev.map((o) =>
          o.id === editingOwner.id
            ? {
                ...o,
                name: data.owner.name,
                email: data.owner.email,
                phone: data.owner.phone,
              }
            : o,
        ),
      );

      toaster.success({
        title: "Owner Updated",
        description: `${data.owner.name}'s details were updated.`,
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

  const handleToggleStatus = async (owner: OwnerRow) => {
    setTogglingId(owner.id);
    try {
      const res = await fetch(`${APP_BASE_URL}/owners/${owner.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: !owner.is_active }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Failed to update status");
      }

      setOwners((prev) =>
        prev.map((o) =>
          o.id === owner.id ? { ...o, is_active: data.owner.is_active } : o,
        ),
      );

      toaster.success({
        title: data.owner.is_active ? "Owner Reactivated" : "Owner Deactivated",
        description: `${owner.name} is now ${data.owner.is_active ? "active" : "deactivated"}.`,
        duration: 3000,
        closable: true,
      });
    } catch (error) {
      toaster.error({
        title: "Status Update Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        duration: 5000,
        closable: true,
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteOwner = async () => {
    if (!deletingOwner) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${APP_BASE_URL}/owners/${deletingOwner.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          typeof err?.error === "string"
            ? err.error
            : (err?.error?.message ?? "Failed to delete owner"),
        );
      }

      setOwners((prev) => prev.filter((o) => o.id !== deletingOwner.id));

      toaster.success({
        title: "Owner Deleted",
        description: `${deletingOwner.name}'s account was permanently deleted.`,
        duration: 3000,
        closable: true,
      });

      setDeletingOwner(null);
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

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchOwners = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const [ownersRes, turfsRes] = await Promise.all([
          fetch(`${APP_BASE_URL}/owners`, { credentials: "include" }),
          fetch(`${APP_BASE_URL}/turfs`),
        ]);

        if (!ownersRes.ok) throw new Error("Failed to fetch owners");
        if (!turfsRes.ok) throw new Error("Failed to fetch turfs");

        const { owners: ownerData } = await ownersRes.json();
        const { turfs } = await turfsRes.json();

        const turfCountByOwner = new Map<number, number>();
        turfs.forEach((t: any) => {
          turfCountByOwner.set(
            t.owner_id,
            (turfCountByOwner.get(t.owner_id) ?? 0) + 1,
          );
        });

        const rows: OwnerRow[] = ownerData.map((o: any) => ({
          id: o.id,
          name: o.name,
          email: o.email,
          phone: o.phone,
          is_active: o.is_active,
          turfCount: turfCountByOwner.get(o.id) ?? 0,
        }));

        setOwners(rows);
      } catch (err) {
        setIsError(true);
        toaster.error({
          title: "Failed to load owners",
          description: "Please try refreshing the page.",
          duration: 4000,
          closable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwners();
  }, []);

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
            Failed to load owners. Please try again later.
          </Alert.Description>
        </Alert.Root>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexWrap="wrap"
        gap={3}
      >
        <Box>
          <Heading size="lg">Owners</Heading>
          <Text color="fg.muted" mt={1}>
            {owners.length} owner{owners.length !== 1 ? "s" : ""} on the
            platform
          </Text>
        </Box>
        <Button
          colorPalette="purple"
          size="sm"
          borderRadius="full"
          onClick={() => setIsCreating(true)}
        >
          + New Owner
        </Button>
      </Flex>

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
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Phone</Table.ColumnHeader>
              <Table.ColumnHeader>Turfs</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {owners.map((owner) => (
              <Table.Row key={owner.id}>
                <Table.Cell fontWeight="medium">{owner.name}</Table.Cell>
                <Table.Cell>{owner.email ?? "—"}</Table.Cell>
                <Table.Cell>{owner.phone}</Table.Cell>
                <Table.Cell>{owner.turfCount}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={owner.is_active ? "green" : "red"}>
                    {owner.is_active ? "Active" : "Deactivated"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <HStack gap={1}>
                    <IconButton
                      aria-label="Edit owner"
                      size="sm"
                      variant="ghost"
                      colorPalette="blue"
                      onClick={() => openEditModal(owner)}
                    >
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton
                      aria-label={
                        owner.is_active
                          ? "Deactivate owner"
                          : "Reactivate owner"
                      }
                      size="sm"
                      variant="ghost"
                      colorPalette={owner.is_active ? "orange" : "green"}
                      loading={togglingId === owner.id}
                      onClick={() => handleToggleStatus(owner)}
                    >
                      <Power size={16} />
                    </IconButton>
                    <IconButton
                      aria-label="Reset password"
                      size="sm"
                      variant="ghost"
                      colorPalette="purple"
                      onClick={() => setResettingOwner(owner)}
                    >
                      <KeyRound size={16} />
                    </IconButton>
                    <IconButton
                      aria-label="Delete owner"
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => setDeletingOwner(owner)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
            {owners.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Text textAlign="center" color="fg.muted" py={6}>
                    No owners yet.
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
      <Dialog.Root
        open={isCreating}
        onOpenChange={(e) => !e.open && closeCreateModal()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Add New Owner</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Field.Root invalid={!!createErrors.name}>
                    <Field.Label>Full Name *</Field.Label>
                    <Input
                      placeholder="e.g. Ahsan Javed"
                      value={createForm.name}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, name: e.target.value })
                      }
                    />
                    <Field.ErrorText>{createErrors.name}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!createErrors.email}>
                    <Field.Label>Email *</Field.Label>
                    <Input
                      type="email"
                      placeholder="owner@example.com"
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, email: e.target.value })
                      }
                    />
                    <Field.ErrorText>{createErrors.email}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!createErrors.phone}>
                    <Field.Label>Phone Number *</Field.Label>
                    <Input
                      placeholder="03001234567"
                      value={createForm.phone}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, phone: e.target.value })
                      }
                    />
                    <Field.ErrorText>{createErrors.phone}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!createErrors.password}>
                    <Field.Label>Temporary Password *</Field.Label>
                    <InputGroup
                      endElement={
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                          _hover={{ bg: "transparent" }}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      }
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={createForm.password}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            password: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                    <Field.ErrorText>{createErrors.password}</Field.ErrorText>
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={closeCreateModal}>
                  Cancel
                </Button>
                <Button
                  colorPalette="purple"
                  onClick={handleCreateOwner}
                  loading={isSubmitting}
                >
                  Create Owner
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      {/* Edit Owner Dialog */}
      <Dialog.Root
        open={!!editingOwner}
        onOpenChange={(e) => !e.open && closeEditModal()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Owner — {editingOwner?.name}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Field.Root invalid={!!editErrors.name}>
                    <Field.Label>Full Name</Field.Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                    <Field.ErrorText>{editErrors.name}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!editErrors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                    <Field.ErrorText>{editErrors.email}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!editErrors.phone}>
                    <Field.Label>Phone Number</Field.Label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                    <Field.ErrorText>{editErrors.phone}</Field.ErrorText>
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button
                  colorPalette="purple"
                  onClick={handleUpdateOwner}
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
        open={!!deletingOwner}
        onOpenChange={(e) => !e.open && setDeletingOwner(null)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete Owner</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Are you sure you want to permanently delete{" "}
                  <strong>{deletingOwner?.name}</strong>? This cannot be undone.
                  {deletingOwner && deletingOwner.turfCount > 0 && (
                    <Text as="span" color="red.500" display="block" mt={2}>
                      Warning: this owner has {deletingOwner.turfCount} turf
                      {deletingOwner.turfCount !== 1 ? "s" : ""} — deleting them
                      may affect those listings and their booking history.
                      Consider deactivating instead.
                    </Text>
                  )}
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={() => setDeletingOwner(null)}
                >
                  Cancel
                </Button>
                <Button
                  colorPalette="red"
                  onClick={handleDeleteOwner}
                  loading={isDeleting}
                >
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Reset Password Dialog */}
      <Dialog.Root
        open={!!resettingOwner}
        onOpenChange={(e) => !e.open && closeResetModal()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  Reset Password — {resettingOwner?.name}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Text fontSize="sm" color="fg.muted">
                    Set a new temporary password for this owner. Share it with
                    them securely — they can change it themselves afterward from
                    their profile page.
                  </Text>
                  <Field.Root invalid={!!resetError}>
                    <Field.Label>New Password</Field.Label>
                    <InputGroup
                      endElement={
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() =>
                            setShowResetPassword(!showResetPassword)
                          }
                          variant="ghost"
                          size="sm"
                          _hover={{ bg: "transparent" }}
                        >
                          {showResetPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      }
                    >
                      <Input
                        type={showResetPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setResetError("");
                        }}
                      />
                    </InputGroup>
                    <Field.ErrorText>{resetError}</Field.ErrorText>
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={closeResetModal}>
                  Cancel
                </Button>
                <Button
                  colorPalette="purple"
                  onClick={handleResetPassword}
                  loading={isResetting}
                >
                  Reset Password
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default SuperAdminOwnerListPage;
