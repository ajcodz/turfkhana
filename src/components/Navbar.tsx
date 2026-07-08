import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  // Menu,
  useDisclosure,
  Stack,
  Container,
  Drawer,
  Avatar,
  Text,
  // Badge,
  VStack,
  Portal,
  CloseButton,
  Image,
} from "@chakra-ui/react";
import {
  AlignJustify,
  X,
  // User,
  // LogOut,
  // Settings,
  // Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { ColorModeButton, useColorModeValue } from "./ui/color-mode";
import { Link, useLocation, useNavigate } from "react-router-dom";

// interface NavLinkProps {
//   children: React.ReactNode;
//   to?: string;
//   onClick?: () => void;
// }

// const NavLink: React.FC<NavLinkProps> = ({ children, to = "#", onClick }) => {
//   const hoverBg = useColorModeValue("green.50", "green.900");

//   return (
//     <Link to={to}>
//       <Box
//         px={3}
//         py={2}
//         rounded="md"
//         fontSize="md"
//         fontWeight="medium"
//         color={useColorModeValue("gray.700", "gray.200")}
//         _hover={{
//           textDecoration: "none",
//           bg: hoverBg,
//           color: useColorModeValue("green.600", "green.300"),
//         }}
//         transition="all 0.2s"
//         onClick={onClick}
//         {...({ to: "/" } as any)}
//       >
//         {children}
//       </Box>
//     </Link>
//   );
// };

const Navbar: React.FC = () => {
  const location = useLocation();
  const { open, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setIsClientLoggedIn(localStorage.getItem("isClientLoggedIn") === "true");
    const client = JSON.parse(localStorage.getItem("client") ?? "{}");
    setClientName(client?.name ?? "");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("owner");
    setIsLoggedIn(false);
    navigate("/admin/login", { replace: true });
  };

  const handleClientLogout = () => {
    localStorage.removeItem("isClientLoggedIn");
    localStorage.removeItem("client");
    setIsClientLoggedIn(false);
    setClientName("");
    navigate("/", { replace: true });
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const isDashboard = location.pathname.startsWith("/dashboard");

  // const navLinks = [
  //   { name: "Home", to: "/" },
  //   { name: "Browse Turfs", to: "/turfs" },
  //   { name: "Locations", to: "/locations" },
  //   { name: "About", to: "/about" },
  //   { name: "Contact", to: "/contact" },
  // ];

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   console.log("User logged out");
  // };

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position={isDashboard ? "relative" : "sticky"}
      top={0}
      zIndex={1000}
      shadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Link to="/">
            <Box
              fontSize="2xl"
              fontWeight="bold"
              color="green.500"
              _hover={{ color: "green.600" }}
              transition="color 0.2s"
            >
              <Image
                src="/TurfKhana Logo Transparent.png"
                alt="TurfKhana"
                h={12}
              />
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {/* <HStack gap={1} display={{ base: "none", md: "flex" }}>
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.to}>
                {link.name}
              </NavLink>
            ))}
          </HStack> */}

          {/* Right Side Actions */}
          <Flex alignItems="center" gap={3}>
            {isLoggedIn ? (
              // Owner logout button — only shows on admin pages
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                display={{ base: "none", sm: "inline-flex" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : isClientLoggedIn ? (
              // Client logout button
              <HStack gap={2} display={{ base: "none", sm: "flex" }}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Hi, {clientName}!
                </Text>
                <Button
                  colorPalette="red"
                  variant="outline"
                  size="sm"
                  onClick={handleClientLogout}
                >
                  Logout
                </Button>
              </HStack>
            ) : (
              // Not logged in — show Login button
              <Link to="/login">
                <Button
                  colorPalette="green"
                  size="sm"
                  display={{ base: "none", sm: "inline-flex" }}
                >
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              size="md"
              aria-label="Open Menu"
              display={{ md: "none" }}
              onClick={open ? onClose : onOpen}
              variant="ghost"
            >
              {open ? <X /> : <AlignJustify />}
            </IconButton>
            <ColorModeButton />
          </Flex>
        </Flex>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer.Root
        open={open}
        placement="start"
        onInteractOutside={onClose}
        onEscapeKeyDown={onClose}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.CloseTrigger asChild>
                <CloseButton onClick={onClose} />
              </Drawer.CloseTrigger>
              <Drawer.Body pt={16}>
                <Stack gap={4}>
                  {/* User Info for Mobile (if logged in) */}
                  {(isLoggedIn || isClientLoggedIn) && (
                    <Box
                      p={4}
                      bg={useColorModeValue("green.50", "green.900")}
                      borderRadius="lg"
                      mb={4}
                    >
                      <Flex align="center" gap={3}>
                        <Avatar.Root size="md" bg="green.500">
                          <Avatar.Fallback name={clientName || "Admin"} />
                        </Avatar.Root>
                        <Box>
                          <Text fontWeight="semibold">
                            {isClientLoggedIn ? clientName : "Admin"}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {isClientLoggedIn
                              ? (JSON.parse(
                                  localStorage.getItem("client") ?? "{}",
                                ).email ?? "")
                              : (JSON.parse(
                                  localStorage.getItem("owner") ?? "{}",
                                ).email ?? "")}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  )}

                  {/* Navigation Links */}
                  {/* {navLinks.map((link) => (
                    <NavLink key={link.name} to={link.to} onClick={onClose}>
                      {link.name}
                    </NavLink>
                  ))} */}

                  <Box borderTop="1px" borderColor={borderColor} pt={4} mt={4}>
                    {isLoggedIn ? (
                      <Button
                        colorPalette="red"
                        variant="outline"
                        w="100%"
                        onClick={() => {
                          handleLogout();
                          onClose();
                        }}
                      >
                        Logout
                      </Button>
                    ) : isClientLoggedIn ? (
                      <Button
                        colorPalette="red"
                        variant="outline"
                        w="100%"
                        onClick={() => {
                          handleClientLogout();
                          onClose();
                        }}
                      >
                        Logout
                      </Button>
                    ) : (
                      <Link to="/login">
                        <Button colorPalette="green" w="100%" onClick={onClose}>
                          Login
                        </Button>
                      </Link>
                    )}
                  </Box>

                  {/* Contact Info */}
                  <Box borderTop="1px" borderColor={borderColor} pt={4} mt={4}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      mb={3}
                      color="gray.600"
                    >
                      Contact Us
                    </Text>
                    <VStack align="stretch" gap={2}>
                      <HStack fontSize="sm" color="gray.600">
                        <Phone size={16} />
                        <Text>+92 315 4807718</Text>
                      </HStack>
                      <HStack fontSize="sm" color="gray.600">
                        <Mail size={16} />
                        <Text>ajcodzhq@gmail.com</Text>
                      </HStack>
                      <HStack fontSize="sm" color="gray.600">
                        <MapPin size={16} />
                        <VStack alignItems={"start"} gap={0}>
                          <Text>Plot No. 59/B</Text>
                          <Text>Koh-e-Noor Housing Scheme, Lahore</Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Box>
                </Stack>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default Navbar;
