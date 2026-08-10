import React, { useState } from "react";
import {
  Box,
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
  Input,
  InputGroup,
  NativeSelect,
  Button,
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { Card, CardBody } from "@chakra-ui/card";
import { Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTurfs } from "../useLandingPage";
import { useGeolocation } from "../hooks/useGeolocation";
import { calculateDistanceKm, formatDistance } from "../utils/distance";

type SortOption = "nearest" | "price_low" | "price_high" | "name";

const BrowseTurfsPage: React.FC = () => {
  const { data: turfs = [], isLoading, isError } = useTurfs();
  const location = useGeolocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("nearest");

  const cardBg = useColorModeValue("white", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.800");

  const categories = ["All", "Cricket", "Futsal"];

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

  const query = searchQuery.trim().toLowerCase();

  const filtered = turfsWithDistance.filter((turf) => {
    const matchesCategory =
      selectedCategory === "All" ||
      turf.type.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !query ||
      turf.name.toLowerCase().includes(query) ||
      turf.address.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "nearest":
        return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
      case "price_low":
        return a.price_per_slot - b.price_per_slot;
      case "price_high":
        return b.price_per_slot - a.price_per_slot;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack align="stretch" gap={6}>
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Browse Turfs
            </Heading>
            <Text color="fg.muted" fontSize="lg">
              {sorted.length} turf{sorted.length !== 1 ? "s" : ""} available
              {location.status === "success" && sortBy === "nearest"
                ? ", sorted by distance from you"
                : ""}
            </Text>
            {location.status === "denied" && (
              <Text fontSize="sm" color="orange.500" mt={1}>
                Enable location access in your browser to sort by nearest turfs.
              </Text>
            )}
          </Box>

          {/* Search + Filters */}
          <Box bg={cardBg} p={4} borderRadius="xl" shadow="sm">
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              align={{ base: "stretch", md: "center" }}
            >
              <InputGroup
                startElement={<Icon as={Search} color="fg.subtle" />}
                flex={1}
              >
                <Input
                  placeholder="Search by turf name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <NativeSelect.Root maxW={{ base: "100%", md: "180px" }}>
                <NativeSelect.Field
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>

              <NativeSelect.Root maxW={{ base: "100%", md: "220px" }}>
                <NativeSelect.Field
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="nearest">Sort: Nearest</option>
                  <option value="price_low">Sort: Price (Low to High)</option>
                  <option value="price_high">Sort: Price (High to Low)</option>
                  <option value="name">Sort: Name (A-Z)</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Flex>
          </Box>

          {/* Loading */}
          {isLoading && (
            <Flex justify="center" py={12}>
              <Spinner size="xl" color="green.500" />
            </Flex>
          )}

          {/* Error */}
          {isError && (
            <Alert.Root status="error" borderRadius="lg">
              <Alert.Description>
                Failed to load turfs. Please try again later.
              </Alert.Description>
            </Alert.Root>
          )}

          {/* Results Grid */}
          {!isLoading && !isError && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
              {sorted.map((turf) => (
                <Card
                  key={turf.id}
                  bg={cardBg}
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-8px)", shadow: "2xl" }}
                  borderRadius="xl"
                >
                  <Box position="relative">
                    <Image
                      src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&h=300&fit=crop"
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
                      <HStack fontSize="sm" color="fg.muted">
                        <Icon as={MapPin} boxSize={4} />
                        <Text>{turf.address}</Text>
                      </HStack>
                      {turf.distanceKm != null && (
                        <Text
                          fontSize="xs"
                          color="green.fg"
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
                          <Text fontSize="xs" color="fg.muted">
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
          {!isLoading && !isError && sorted.length === 0 && (
            <Flex justify="center" py={12}>
              <Text color="fg.muted" fontSize="lg">
                No turfs match your search.
              </Text>
            </Flex>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BrowseTurfsPage;
