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
  Code,
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import { APP_BASE_URL } from "../utils/api";

const PAGE_SIZE = 25;

interface AuditLogRow {
  id: number;
  actor_name: string;
  actor_role: string;
  action: string;
  target_type: string;
  target_id: number | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const actionColor = (action: string) => {
  if (action.startsWith("delete")) return "red";
  if (action.startsWith("deactivate") || action.startsWith("disable"))
    return "orange";
  if (action.startsWith("reactivate") || action.startsWith("enable"))
    return "green";
  if (action.startsWith("create")) return "purple";
  return "gray";
};

const formatAction = (action: string) =>
  action
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatDetails = (details: Record<string, unknown> | null) => {
  if (!details) return "—";
  return Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
};

const SuperAdminAuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(
          `${APP_BASE_URL}/audit-logs?limit=${PAGE_SIZE}&offset=${offset}`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("Failed to fetch audit logs");

        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
      } catch {
        setIsError(true);
        toaster.error({
          title: "Failed to load audit logs",
          description: "Please try refreshing the page.",
          duration: 4000,
          closable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [offset]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

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
            Failed to load audit logs. Please try again later.
          </Alert.Description>
        </Alert.Root>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Box mb={6}>
        <Heading size="lg">Audit Log</Heading>
        <Text color="fg.muted" mt={1}>
          {total} recorded action{total !== 1 ? "s" : ""} by super admins
        </Text>
      </Box>

      <Box
        bg={cardBg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        overflowX="auto"
      >
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>When</Table.ColumnHeader>
              <Table.ColumnHeader>Actor</Table.ColumnHeader>
              <Table.ColumnHeader>Action</Table.ColumnHeader>
              <Table.ColumnHeader>Target</Table.ColumnHeader>
              <Table.ColumnHeader>Details</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {logs.map((log) => (
              <Table.Row key={log.id}>
                <Table.Cell fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </Table.Cell>
                <Table.Cell fontWeight="medium">{log.actor_name}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={actionColor(log.action)}>
                    {formatAction(log.action)}
                  </Badge>
                </Table.Cell>
                <Table.Cell fontSize="sm">
                  {log.target_type}
                  {log.target_id ? ` #${log.target_id}` : ""}
                </Table.Cell>
                <Table.Cell fontSize="xs">
                  <Code fontSize="xs" whiteSpace="normal">
                    {formatDetails(log.details)}
                  </Code>
                </Table.Cell>
              </Table.Row>
            ))}
            {logs.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text textAlign="center" color="fg.muted" py={6}>
                    No actions recorded yet.
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {totalPages > 1 && (
        <Flex justify="space-between" align="center" mt={4}>
          <Text fontSize="sm" color="fg.muted">
            Page {currentPage} of {totalPages}
          </Text>
          <Flex gap={2}>
            <Button
              size="sm"
              variant="outline"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={offset + PAGE_SIZE >= total}
              onClick={() => setOffset(offset + PAGE_SIZE)}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default SuperAdminAuditLogPage;
