import React from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Stack,
  Separator,
  Image,
} from "@chakra-ui/react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useColorModeValue } from "./ui/color-mode";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const bgColor = useColorModeValue("gray.900", "gray.950");
  const textColor = useColorModeValue("gray.300", "gray.400");
  const headingColor = useColorModeValue("white", "gray.100");
  const linkHoverColor = useColorModeValue("green.400", "green.300");
  const borderColor = useColorModeValue("gray.700", "gray.800");

  const currentYear = new Date().getFullYear();

  return (
    <Box bg={bgColor} color={textColor} pt={16} pb={8}>
      <Container maxW="container.xl">
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          }}
          gap={8}
          mb={12}
        >
          {/* Company Info */}
          <GridItem>
            <VStack align="flex-start" gap={4}>
              <Heading as="h3" size="lg" color="green.500" mb={2}>
                <Image src="/TurfKhana Logo Transparent.png" alt="TurfKhana" h={16} />
              </Heading>
              <Text fontSize="sm" lineHeight="tall">
                Pakistan's premier indoor turf booking platform. Book your
                favorite sports venues instantly and play hassle-free.
              </Text>
              <HStack gap={3} pt={2}>
                <IconButton
                  aria-label="Facebook"
                  size="sm"
                  variant="ghost"
                  color="white"
                  colorScheme="whiteAlpha"
                  _hover={{ bg: "green.600", color: "white" }}
                >
                  <Link to="https://facebook.com" target="_blank">
                    <Facebook size={18} />
                  </Link>
                </IconButton>
                <IconButton
                  aria-label="Instagram"
                  size="sm"
                  variant="ghost"
                  color="white"
                  colorScheme="whiteAlpha"
                  _hover={{ bg: "green.600", color: "white" }}
                >
                  <Link to="https://instagram.com" target="_blank">
                    <Instagram size={18} />
                  </Link>
                </IconButton>
                <IconButton
                  aria-label="Twitter"
                  size="sm"
                  variant="ghost"
                  color="white"
                  colorScheme="whiteAlpha"
                  _hover={{ bg: "green.600", color: "white" }}
                >
                  <Link to="https://twitter.com" target="_blank">
                    <Twitter size={18} />
                  </Link>
                </IconButton>
                <IconButton
                  aria-label="YouTube"
                  size="sm"
                  variant="ghost"
                  color="white"
                  colorScheme="whiteAlpha"
                  _hover={{ bg: "green.600", color: "white" }}
                >
                  <Link to="https://youtube.com" target="_blank">
                    <Youtube size={18} />
                  </Link>
                </IconButton>
              </HStack>
            </VStack>
          </GridItem>

          {/* Quick Links */}
          {/* <GridItem>
            <VStack align="flex-start" gap={3}>
              <Heading as="h4" size="sm" color={headingColor} mb={2}>
                Quick Links
              </Heading>
              <Link to="/turfs">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  Browse Turfs
                </Text>
              </Link>
              <Link to="/locations">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  Locations
                </Text>
              </Link>
              <Link to="/about">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  About Us
                </Text>
              </Link>
              <Link to="/how-it-works">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  How It Works
                </Text>
              </Link>
              <Link to="/pricing">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  Pricing
                </Text>
              </Link>
              <Link to="/faq">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  FAQ
                </Text>
              </Link>
            </VStack>
          </GridItem> */}

          {/* Legal */}
          <GridItem>
            <VStack align="flex-start" gap={3}>
              <Heading as="h4" size="sm" color={headingColor} mb={2}>
                Legal
              </Heading>
              <Link to="/terms-and-conditions-policy">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  Terms & Conditions
                </Text>
              </Link>
              <Link to="/privacy-policy">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  Privacy Policy
                </Text>
              </Link>
              <Link to="/refund-and-cancellation-policy">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  Refund & Cancellation
                </Text>
              </Link>
              {/* <Link
                to="/cookie-policy"
                fontSize="sm"
                _hover={{ color: linkHoverColor, textDecoration: 'none' }}
              >
                Cookie Policy
              </Link> */}
            </VStack>
          </GridItem>

          <GridItem>
            <VStack align="flex-start" gap={3}>
              <Heading as="h4" size="sm" color={headingColor} mb={2}>
                For Owners
              </Heading>
              <Link to="/login">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  List Your Turf
                </Text>
              </Link>
              <Link to="/login">
                <Text
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: "none" }}
                >
                  Partner With Us
                </Text>
              </Link>
            </VStack>
          </GridItem>

          {/* Contact Info */}
          <GridItem>
            <VStack align="flex-start" gap={3}>
              <Heading as="h4" size="sm" color={headingColor} mb={2}>
                Get In Touch
              </Heading>

              <VStack align="flex-start" gap={3} fontSize="sm">
                <HStack align="flex-start" gap={3}>
                  <Box mt="2px">
                    <MapPin size={18} />
                  </Box>
                  <Text>
                    Plot No. 59/B Koh-e-Noor Housing Scheme
                    <br />
                    Lahore, Punjab, Pakistan
                  </Text>
                </HStack>

                <HStack gap={3}>
                  <Phone size={18} />
                  <Link to="tel:+923154807718">
                    <Text
                      fontSize="sm"
                      _hover={{ color: linkHoverColor, textDecoration: "none" }}
                    >
                      +92 315 4807718
                    </Text>
                  </Link>
                </HStack>

                <HStack gap={3}>
                  <Mail size={18} />
                  <Link to="mailto:ajcodzhq@gmail.com">
                    <Text
                      fontSize="sm"
                      _hover={{ color: linkHoverColor, textDecoration: "none" }}
                    >
                      ajcodzhq@gmail.com
                    </Text>
                  </Link>
                </HStack>

                {/* <HStack align="flex-start" gap={3}>
                  <Box mt="2px">
                    <Clock size={18} />
                  </Box>
                  <Text>
                    Customer Support
                    <br />
                    9:00 AM - 10:00 PM Daily
                  </Text>
                </HStack> */}
              </VStack>
            </VStack>
          </GridItem>
        </Grid>

        <Separator borderColor={borderColor} mb={8} />

        {/* Bottom Section */}
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="sm" textAlign={{ base: "center", md: "left" }}>
            © {currentYear} TurfKhana. All rights reserved.
          </Text>

          {/* <HStack gap={6} fontSize="sm" flexWrap="wrap" justify="center">
            <Link to="/sitemap" _hover={{ color: linkHoverColor }}>
              Sitemap
            </Link>
            <Link to="/accessibility" _hover={{ color: linkHoverColor }}>
              Accessibility
            </Link>
            <Link to="/careers" _hover={{ color: linkHoverColor }}>
              Careers
            </Link>
            <Link to="/blog" _hover={{ color: linkHoverColor }}>
              Blog
            </Link>
          </HStack> */}

          <HStack gap={3} fontSize="xs">
            <Text>Developed by AJ Codz</Text>
          </HStack>
        </Stack>

        {/* Additional Info */}
        {/* <Box mt={8} pt={6} borderTop="1px" borderColor={borderColor}>
          <Text fontSize="xs" textAlign="center" color="gray.500">
            TurfKhana is a registered trademark. We facilitate bookings between users and
            independent turf facility owners. Payment processing powered by PayFast.
          </Text>
        </Box> */}
      </Container>
    </Box>
  );
};

export default Footer;
