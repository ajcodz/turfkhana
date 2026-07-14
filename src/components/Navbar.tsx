import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Container,
  Drawer,
  Avatar,
  Text,
  VStack,
  Portal,
  CloseButton,
  Image,
} from "@chakra-ui/react";
import {
  AlignJustify,
  X,
  LogOut,
  BookOpen,
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
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [clientName, setClientName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const syncAuthState = () => {
    setIsClientLoggedIn(localStorage.getItem("isClientLoggedIn") === "true");
    const client = JSON.parse(localStorage.getItem("client") ?? "{}");
    setClientName(client?.name ?? "");
  };

  useEffect(() => {
    // Sync on route change
    syncAuthState();

    // Sync across tabs when localStorage changes in another tab
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, [location.pathname]);

  const handleClientLogout = () => {
    localStorage.removeItem("isClientLoggedIn");
    localStorage.removeItem("client");
    setIsClientLoggedIn(false);
    setClientName("");
    navigate("/login", { replace: true });
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAdminPage = location.pathname.startsWith("/admin");

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
            {isAdminPage ? null : isClientLoggedIn ? (
              // Client Avatar with dropdown menu
              <Box position="relative" display={{ base: "none", sm: "block" }}>
                {/* Avatar trigger */}
                <Avatar.Root
                  size="sm"
                  bg="green.500"
                  cursor="pointer"
                  _hover={{ opacity: 0.85 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Avatar.Fallback name={clientName} />
                </Avatar.Root>

                {/* Custom dropdown */}
                {isMenuOpen && (
                  <>
                    {/* Invisible overlay to close menu on outside click */}
                    <Box
                      position="fixed"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      zIndex={998}
                      onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Dropdown content */}
                    <Box
                      position="absolute"
                      top="110%"
                      right={0}
                      zIndex={999}
                      bg={bgColor}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      shadow="lg"
                      minW="200px"
                      overflow="hidden"
                    >
                      {/* Client info header */}
                      <Box
                        px={4}
                        py={3}
                        borderBottomWidth="1px"
                        borderColor={borderColor}
                      >
                        <Text fontSize="sm" fontWeight="semibold">
                          {clientName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {JSON.parse(localStorage.getItem("client") ?? "{}")
                            .email ?? ""}
                        </Text>
                      </Box>

                      {/* Past Bookings */}
                      <Box
                        px={4}
                        py={3}
                        cursor="pointer"
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.700"),
                        }}
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/past-bookings");
                        }}
                      >
                        <HStack gap={2}>
                          <BookOpen size={16} />
                          <Text fontSize="sm">Past Bookings</Text>
                        </HStack>
                      </Box>

                      {/* Logout */}
                      <Box
                        px={4}
                        py={3}
                        cursor="pointer"
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.700"),
                        }}
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleClientLogout();
                        }}
                      >
                        <HStack gap={2} color="red.500">
                          <LogOut size={16} />
                          <Text fontSize="sm">Logout</Text>
                        </HStack>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
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
                  {!isAdminPage && isClientLoggedIn && (
                    <Box
                      p={4}
                      bg={useColorModeValue("green.50", "green.900")}
                      borderRadius="lg"
                      mb={4}
                    >
                      <Flex align="center" gap={3}>
                        <Avatar.Root size="md" bg="green.500">
                          <Avatar.Fallback name={clientName} />
                        </Avatar.Root>
                        <Box>
                          <Text fontWeight="semibold">{clientName}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {JSON.parse(localStorage.getItem("client") ?? "{}")
                              .email ?? ""}
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
                    {isAdminPage ? null : isClientLoggedIn ? (
                      <VStack gap={2} align="stretch">
                        <Link to="/past-bookings">
                          <Button
                            variant="outline"
                            colorPalette="green"
                            w="100%"
                            onClick={onClose}
                          >
                            <BookOpen size={16} />
                            Past Bookings
                          </Button>
                        </Link>
                        <Button
                          colorPalette="red"
                          variant="outline"
                          w="100%"
                          onClick={() => {
                            handleClientLogout();
                            onClose();
                          }}
                        >
                          <LogOut size={16} />
                          Logout
                        </Button>
                      </VStack>
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
