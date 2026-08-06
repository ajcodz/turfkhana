import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Drawer,
  useDisclosure,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import {
  Users,
  MapPin,
  BookOpen,
  History,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { Link, Outlet, useNavigate } from "react-router-dom";

export type SuperAdminDashboardContext = {
  setActiveNav: React.Dispatch<React.SetStateAction<string>>;
  onOpen: () => void;
};

const SuperAdminDashboardPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState("Owners");
  const superAdmin = JSON.parse(localStorage.getItem("superAdmin") ?? "{}");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/super-admins/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // even if the request fails, still clear local UI state below
    }
    localStorage.removeItem("superAdmin");
    navigate("/super-admin/login", { replace: true });
  };

  const { open, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const navHoverBg = useColorModeValue("purple.50", "gray.700");
  const activeNavBg = useColorModeValue("purple.100", "purple.900");

  const navItems = [
    { name: "Owners", path: "/super-admin/dashboard", icon: Users },
    { name: "Turfs", path: "turfs", icon: MapPin },
    { name: "Bookings", path: "bookings", icon: BookOpen },
    { name: "Audit Log", path: "audit-log", icon: History },
  ];

  const SidebarContent = () => (
    <VStack align="stretch" gap={1} h="100%">
      <Box p={6} borderBottomWidth="1px" borderColor={borderColor}>
        <HStack gap={2}>
          <Icon as={ShieldCheck} color="purple.500" boxSize={6} />
          <Text fontWeight="bold" fontSize="lg">
            TurfKhana
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.500" mt={1}>
          Super Admin Portal
        </Text>
      </Box>

      <VStack align="stretch" gap={1} p={4} flex={1}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            style={{ width: "100%", display: "block" }}
          >
            <Button
              variant="ghost"
              justifyContent="flex-start"
              bg={activeNav === item.name ? activeNavBg : "transparent"}
              color={activeNav === item.name ? "purple.600" : "gray.600"}
              _hover={{ bg: navHoverBg }}
              onClick={() => {
                setActiveNav(item.name);
                onClose();
              }}
              h={12}
              w="100%"
              fontSize="md"
              fontWeight={activeNav === item.name ? "semibold" : "normal"}
            >
              <Icon as={item.icon} boxSize={5} />
              {item.name}
              <Icon as={ChevronRight} boxSize={4} ml="auto" />
            </Button>
          </Link>
        ))}
      </VStack>

      <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
        <VStack gap={3} align="stretch">
          <HStack gap={3}>
            <Avatar.Root size="sm" bg="purple.500">
              <Avatar.Fallback name={superAdmin?.name ?? "Super Admin"} />
            </Avatar.Root>
            <Box flex={1}>
              <Text fontSize="sm" fontWeight="semibold">
                {superAdmin?.name ?? "Super Admin"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {superAdmin?.email ?? "—"}
              </Text>
            </Box>
          </HStack>
          <Button
            colorPalette="red"
            variant="outline"
            size="sm"
            w="100%"
            onClick={handleLogout}
          >
            <Icon as={LogOut} boxSize={4} />
            Logout
          </Button>
        </VStack>
      </Box>
    </VStack>
  );

  return (
    <Flex minH="100vh" bg={bgColor}>
      <Box
        display={{ base: "none", lg: "block" }}
        w="280px"
        bg={sidebarBg}
        borderRightWidth="1px"
        borderColor={borderColor}
        position="absolute"
        h="93vh"
        overflowY="auto"
      >
        <SidebarContent />
      </Box>

      <Drawer.Root
        open={open}
        placement="start"
        onInteractOutside={onClose}
        onEscapeKeyDown={onClose}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg={sidebarBg}>
              <Drawer.CloseTrigger asChild>
                <CloseButton onClick={onClose} size="sm" />
              </Drawer.CloseTrigger>
              <Drawer.Body p={0}>
                <SidebarContent />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <Box flex={1} h="93vh" overflowY="auto" ml={{ base: 0, lg: "280px" }}>
        <Outlet context={{ setActiveNav, onOpen }} />
      </Box>
    </Flex>
  );
};

export default SuperAdminDashboardPage;
