import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  Badge,
  Flex,
  Icon,
  Alert,
  Spinner,
} from "@chakra-ui/react";
import { useColorModeValue } from "./components/ui/color-mode";
import { Card, CardBody } from "@chakra-ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTurfs } from "./useLandingPage";
import { useGeolocation } from "./hooks/useGeolocation";
import { calculateDistanceKm, formatDistance } from "./utils/distance";

const LandingPage: React.FC = () => {
  const { data: turfs = [], isLoading, isError } = useTurfs();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const location = useGeolocation();

  const turfsWithDistance = turfs.map((turf) => {
    const hasCoords = turf.lat != null && turf.lng != null;
    const distanceKm =
      location.status === "success" && hasCoords
        ? calculateDistanceKm(
            location.latitude!,
            location.longitude!,
            turf.lat as number,
            turf.lng as number,
          )
        : null;
    return { ...turf, distanceKm };
  });

  // Derive filtered + sorted turfs from API data
  const categoryFiltered =
    selectedCategory === "All"
      ? turfsWithDistance
      : turfsWithDistance.filter(
          (turf) => turf.type.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const sortedTurfs =
    location.status === "success"
      ? [...categoryFiltered].sort(
          (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
        )
      : categoryFiltered;

  const filteredTurfs = sortedTurfs.slice(0, 4); // top 4 only

  const bgGradient = useColorModeValue(
    "linear(to-br, green.50, teal.50)",
    "linear(to-br, gray.900, gray.800)",
  );
  const cardBg = useColorModeValue("white", "gray.700");
  const badgeBg = useColorModeValue("green.100", "green.900");
  const badgeColor = useColorModeValue("green.800", "green.100");

  const categories = ["All", "Cricket", "Futsal"];

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        py={{ base: 16, md: 24 }}
        px={4}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack gap={6} textAlign="center" py={8}>
            <Badge
              bg={badgeBg}
              color={badgeColor}
              colorScheme="green"
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              Book Your Perfect Turf
            </Badge>
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="shorter"
              maxW="4xl"
            >
              Find & Book Premium Indoor Turfs in{" "}
              <Text as="span" color="green.500">
                Minutes
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="2xl"
            >
              Experience the best indoor cricket and futsal facilities across
              Lahore. Book instantly, play immediately.
            </Text>
            <Link to="/turf-details/1">
              <Button
                colorScheme="green"
                size="lg"
                px={8}
                py={6}
                fontSize="lg"
                borderRadius="full"
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                transition="all 0.2s"
              >
                Book a Turf
              </Button>
            </Link>
            <HStack gap={8} pt={4} flexWrap="wrap" justify="center">
              <HStack>
                <Icon as={MapPin} color="green.500" />
                <Text fontSize="sm" color="gray.600">
                  15+ Locations
                </Text>
              </HStack>
              <HStack>
                <Icon as={Calendar} color="green.500" />
                <Text fontSize="sm" color="gray.600">
                  24/7 Booking
                </Text>
              </HStack>
              <HStack>
                <Icon as={Users} color="green.500" />
                <Text fontSize="sm" color="gray.600">
                  5000+ Players
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxW="container.xl" pb={12}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h2" size="xl" mb={2}>
              Browse by Category
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Choose your sport and find the perfect venue
            </Text>
          </Box>

          <Flex justify="center" gap={4} flexWrap="wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "solid" : "outline"}
                colorScheme="green"
                size="lg"
                borderRadius="full"
                px={8}
                onClick={() => {
                  setSelectedCategory(category);
                }}
              >
                {category}
              </Button>
            ))}
          </Flex>
        </VStack>
      </Container>

      {/* Available Turfs Section */}
      <Box bg={useColorModeValue("gray.50", "gray.800")} py={16}>
        <Container maxW="container.xl">
          <VStack gap={8} align="stretch">
            <Box>
              <Heading as="h2" size="xl" mb={2}>
                Available Turfs
              </Heading>
              <Text color="gray.600" fontSize="lg">
                {location.status === "success"
                  ? "Sorted by distance from you"
                  : "Book your slot at premium indoor facilities"}
              </Text>
              {location.status === "denied" && (
                <Text fontSize="sm" color="orange.500" mt={1}>
                  Enable location access in your browser to see turfs nearest to
                  you.
                </Text>
              )}
            </Box>

            {/* Loading State */}
            {isLoading && (
              <Flex justify="center" py={12}>
                <Spinner size="xl" color="green.500" />
              </Flex>
            )}

            {/* Error State */}
            {isError && (
              <Alert.Root status="error" borderRadius="lg">
                <Alert.Description>
                  Failed to load turfs. Please try again later.
                </Alert.Description>
              </Alert.Root>
            )}

            {/* Turfs Grid */}
            {!isLoading && !isError && (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                {filteredTurfs.map((turf) => (
                  <Card
                    key={turf.id}
                    bg={cardBg}
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-8px)",
                      shadow: "2xl",
                    }}
                    borderRadius="xl"
                  >
                    <Box position="relative">
                      <Image
                        src={`https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&h=300&fit=crop`}
                        alt={turf.name}
                        h="200px"
                        w="100%"
                        objectFit="cover"
                      />
                      <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        colorScheme={
                          turf.type.toLowerCase() === "cricket"
                            ? "blue"
                            : "orange"
                        }
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {turf.type.toUpperCase()}
                      </Badge>
                    </Box>
                    <CardBody>
                      <VStack align="stretch" gap={3}>
                        <Heading as="h3" size="md">
                          {turf.name}
                        </Heading>
                        <HStack fontSize="sm" color="gray.600">
                          <Icon as={MapPin} boxSize={4} />
                          <Text>{turf.address}</Text>
                        </HStack>
                        {turf.distanceKm != null && (
                          <Text
                            fontSize="xs"
                            color="green.600"
                            fontWeight="medium"
                          >
                            {formatDistance(turf.distanceKm)}
                          </Text>
                        )}
                        <Flex justify="space-between" align="center" pt={2}>
                          <Box>
                            <Text
                              fontSize="2xl"
                              fontWeight="bold"
                              color="green.500"
                            >
                              {turf.currency} {turf.price_per_slot}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              per slot
                            </Text>
                          </Box>
                          <Link to={`/turf-details/${turf.id}`}>
                            <Button
                              colorScheme="green"
                              size="sm"
                              borderRadius="full"
                            >
                              View Details
                            </Button>
                          </Link>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredTurfs.length === 0 && (
              <Flex justify="center" py={12}>
                <Text color="gray.500" fontSize="lg">
                  No turfs found for this category.
                </Text>
              </Flex>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Box bg="green.500" py={16} px={4}>
        <Container maxW="container.xl">
          <VStack gap={6} textAlign="center">
            <Heading as="h2" size="xl" color="white">
              Ready to Play?
            </Heading>
            <Text fontSize="lg" color="white" opacity={0.9} maxW="2xl">
              Join thousands of players who trust TurfKhana for their sports
              venue needs
            </Text>
            <Link to="/turf-details/1">
              <Button
                size="lg"
                bg="white"
                color="green.500"
                px={8}
                py={6}
                fontSize="lg"
                borderRadius="full"
                _hover={{ bg: "gray.100", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Start Booking Now
              </Button>
            </Link>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
