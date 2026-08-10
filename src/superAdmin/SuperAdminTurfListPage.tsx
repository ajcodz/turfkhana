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
  IconButton,
  Button,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { Power, Trash2 } from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import { APP_BASE_URL } from "../utils/api";


interface TurfRow {
  id: number;
  name: string;
  type: string;
  ownerName: string;
  ownerIsActive: boolean;
  isActive: boolean;
}

const SuperAdminTurfListPage: React.FC = () => {
  const [turfs, setTurfs] = useState<TurfRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingTurf, setDeletingTurf] = useState<TurfRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchTurfs = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(`${APP_BASE_URL}/turfs/admin/all`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch turfs");

        const { turfs: data } = await res.json();

        setTurfs(
          data.map((t: any) => ({
            id: t.id,
            name: t.name,
            type: t.type,
            ownerName: t.owner_name,
            ownerIsActive: t.owner_is_active,
            isActive: t.is_active,
          })),
        );
      } catch {
        setIsError(true);
        toaster.error({
          title: "Failed to load turfs",
          description: "Please try refreshing the page.",
          duration: 4000,
          closable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  const handleDeleteTurf = async () => {
    if (!deletingTurf) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${APP_BASE_URL}/turfs/${deletingTurf.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          typeof err?.error === "string"
            ? err.error
            : (err?.error?.message ?? "Failed to delete turf"),
        );
      }

      setTurfs((prev) => prev.filter((t) => t.id !== deletingTurf.id));

      toaster.success({
        title: "Turf Deleted",
        description: `${deletingTurf.name} was permanently deleted.`,
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

  const handleToggleStatus = async (turf: TurfRow) => {
    setTogglingId(turf.id);
    try {
      const res = await fetch(`${APP_BASE_URL}/turfs/${turf.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: !turf.isActive }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Failed to update status");
      }

      setTurfs((prev) =>
        prev.map((t) =>
          t.id === turf.id ? { ...t, isActive: data.turf.is_active } : t,
        ),
      );

      toaster.success({
        title: data.turf.is_active ? "Turf Enabled" : "Turf Disabled",
        description: `${turf.name} is now ${data.turf.is_active ? "visible" : "hidden"} on the public site.`,
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
            Failed to load turfs. Please try again later.
          </Alert.Description>
        </Alert.Root>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Box mb={6}>
        <Heading size="lg">Turfs</Heading>
        <Text color="fg.muted" mt={1}>
          {turfs.length} turf{turfs.length !== 1 ? "s" : ""} across the platform
        </Text>
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
              <Table.ColumnHeader>Turf</Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
              <Table.ColumnHeader>Owner</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {turfs.map((turf) => (
              <Table.Row key={turf.id}>
                <Table.Cell fontWeight="medium">{turf.name}</Table.Cell>
                <Table.Cell textTransform="capitalize">{turf.type}</Table.Cell>
                <Table.Cell>
                  {turf.ownerName}
                  {!turf.ownerIsActive && (
                    <Badge ml={2} colorPalette="red" fontSize="2xs">
                      Owner Deactivated
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={turf.isActive ? "green" : "red"}>
                    {turf.isActive ? "Active" : "Disabled"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={1}>
                    <IconButton
                      aria-label={
                        turf.isActive ? "Disable turf" : "Enable turf"
                      }
                      size="sm"
                      variant="ghost"
                      colorPalette={turf.isActive ? "orange" : "green"}
                      loading={togglingId === turf.id}
                      onClick={() => handleToggleStatus(turf)}
                    >
                      <Power size={16} />
                    </IconButton>
                    <IconButton
                      aria-label="Delete turf"
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => setDeletingTurf(turf)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
            {turfs.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text textAlign="center" color="fg.muted" py={6}>
                    No turfs yet.
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
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
                  Are you sure you want to permanently delete{" "}
                  <strong>{deletingTurf?.name}</strong>? This cannot be undone.
                  If this turf has any bookings on record, the delete will be
                  blocked — disable it instead to hide it from the public site.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setDeletingTurf(null)}>
                  Cancel
                </Button>
                <Button
                  colorPalette="red"
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

export default SuperAdminTurfListPage;
