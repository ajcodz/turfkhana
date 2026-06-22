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
  LayoutDashboard,
  Calendar,
  BookOpen,
  Settings,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { Link, Outlet } from "react-router-dom";

export type DashboardContext = {
  setActiveNav: React.Dispatch<React.SetStateAction<string>>;
  onOpen: () => void;
};

const DashboardPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const { open, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const navHoverBg = useColorModeValue("green.50", "gray.700");
  const activeNavBg = useColorModeValue("green.100", "green.900");

  // Mock data
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", path: "calendar", icon: Calendar },
    { name: "Bookings", path: "booking-list", icon: BookOpen },
    { name: "Turfs", path: "turf-list", icon: MapPin },
    { name: "Settings", path: "settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <VStack align="stretch" gap={1} h="100%">
      {/* Logo */}
      {/* <Box p={6} borderBottomWidth="1px" borderColor={borderColor}>
        <Heading as="h2" size="lg" color="green.500">
          TurfKhana
        </Heading>
        <Text fontSize="xs" color="gray.500" mt={1}>
          Admin Portal
        </Text>
      </Box> */}

      {/* Navigation */}
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
              color={activeNav === item.name ? "green.600" : "gray.600"}
              _hover={{ bg: navHoverBg }}
              onClick={() => {
                setActiveNav(item.name);
                onClose();
              }}
              h={12}
              w={"100%"}
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

      {/* User Profile */}
      <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
        <HStack gap={3}>
          <Avatar.Root size="sm" bg="green.500">
            <Avatar.Fallback name="Admin User" />
          </Avatar.Root>
          <Box flex={1}>
            <Text fontSize="sm" fontWeight="semibold">
              Admin User
            </Text>
            <Text fontSize="xs" color="gray.500">
              admin@turfkhana.com
            </Text>
          </Box>
        </HStack>
      </Box>
    </VStack>
  );

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Sidebar - Desktop */}
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

      {/* Sidebar - Mobile Drawer */}
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

      {/* Main Content */}
      <Box flex={1} h="93vh" overflowY="auto">
        <Outlet context={{ setActiveNav, onOpen }} />
      </Box>
    </Flex>
  );
};

export default DashboardPage;
