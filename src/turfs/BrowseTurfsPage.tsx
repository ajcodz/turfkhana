import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Flex,
  Icon,
  Alert,
  Input,
  InputGroup,
  NativeSelect,
  Button,
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { Search, SearchX } from "lucide-react";
import { useTurfs } from "../useLandingPage";
import { useGeolocation } from "../hooks/useGeolocation";
import { calculateDistanceKm } from "../utils/distance";
import { TurfCard, TurfCardSkeleton } from "./TurfCard";

type SortOption = "nearest" | "price_low" | "price_high" | "name";

const BrowseTurfsPage: React.FC = () => {
  const { data: turfs = [], isLoading, isError } = useTurfs();
  const location = useGeolocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("nearest");

  const cardBg = useColorModeValue("white", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const categories = ["All", "Cricket", "Futsal"];

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

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
          <Box
            bg={cardBg}
            p={4}
            borderRadius="xl"
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={3}
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

            {/* Category pills, matching the landing page's filter */}
            <Flex mt={3} gap={2} flexWrap="wrap" align="center">
              {categories.map((c) => (
                <Button
                  key={c}
                  size="sm"
                  borderRadius="full"
                  colorPalette="green"
                  variant={c === selectedCategory ? "solid" : "outline"}
                  onClick={() => setSelectedCategory(c)}
                >
                  {c}
                </Button>
              ))}
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="ghost"
                  ms="auto"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </Flex>
          </Box>

          {/* Loading */}
          {isLoading && (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6}>
              {Array.from({ length: 8 }).map((_, i) => (
                <TurfCardSkeleton key={i} />
              ))}
            </SimpleGrid>
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
          {!isLoading && !isError && sorted.length > 0 && (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6}>
              {sorted.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </SimpleGrid>
          )}

          {/* Empty State */}
          {!isLoading && !isError && sorted.length === 0 && (
            <VStack
              py={16}
              gap={3}
              bg={cardBg}
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={borderColor}
              borderRadius="xl"
            >
              <Icon as={SearchX} boxSize={10} color="fg.subtle" />
              <Heading as="h3" size="md">
                No turfs match your search
              </Heading>
              <Text color="fg.muted" fontSize="sm" textAlign="center" maxW="sm">
                Try a different name or location, or widen the category filter.
              </Text>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  colorPalette="green"
                  size="sm"
                  borderRadius="full"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BrowseTurfsPage;
