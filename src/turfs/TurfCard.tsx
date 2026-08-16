import React from "react";
import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  LinkBox,
  LinkOverlay,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useColorModeValue } from "../components/ui/color-mode";
import { formatDistance } from "../utils/distance";
import { formatTime12 } from "../bookings/bookingSlots";
import type { Turf } from "../../backend/src/models/turf.model";

/** A turf plus the distance the listing pages work out from the browser's location. */
export type TurfWithDistance = Turf & { distanceKm?: number | null };

const TURF_IMAGE =
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop";

/** Sports read as distinct at a glance; anything unrecognised falls back to brand green. */
const typePalette = (type: string) => {
  switch (type.toLowerCase()) {
    case "cricket":
      return "blue";
    case "futsal":
      return "orange";
    default:
      return "green";
  }
};

export const TurfCard: React.FC<{ turf: TurfWithDistance }> = ({ turf }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Unclaimed turfs are listed for discovery only — no owner has set a price yet.
  const isUnclaimed = turf.status === "unclaimed";

  return (
    <LinkBox
      as="article"
      className="group"
      display="flex"
      flexDirection="column"
      h="full"
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      shadow="sm"
      transition="transform 0.25s, box-shadow 0.25s, border-color 0.25s"
      _hover={{
        transform: "translateY(-6px)",
        shadow: "xl",
        borderColor: "green.400",
      }}
      _focusWithin={{
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "green.500",
        outlineOffset: "2px",
      }}
    >
      <Box position="relative" overflow="hidden">
        <Image
          src={TURF_IMAGE}
          alt={turf.name}
          w="full"
          h="180px"
          objectFit="cover"
          transition="transform 0.4s"
          _groupHover={{ transform: "scale(1.06)" }}
        />
        {/* Scrim so the badge and distance stay readable whatever the photo does */}
        <Box
          position="absolute"
          inset="0"
          bgImage="linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 55%)"
        />
        <Badge
          position="absolute"
          top={3}
          left={3}
          colorPalette={typePalette(turf.type)}
          variant="solid"
          borderRadius="full"
          px={2.5}
          py={1}
          fontSize="2xs"
          letterSpacing="wider"
        >
          {turf.type.toUpperCase()}
        </Badge>
        {turf.distanceKm != null && (
          <HStack
            position="absolute"
            bottom={3}
            left={3}
            gap={1}
            color="white"
            fontSize="xs"
            fontWeight="medium"
          >
            <Icon as={MapPin} boxSize={3.5} />
            <Text>{formatDistance(turf.distanceKm)}</Text>
          </HStack>
        )}
      </Box>

      <Flex direction="column" flex="1" p={5} gap={3}>
        <LinkOverlay asChild>
          <RouterLink to={`/turf-details/${turf.id}`}>
            <Heading as="h3" size="md" lineClamp={1}>
              {turf.name}
            </Heading>
          </RouterLink>
        </LinkOverlay>

        <VStack align="stretch" gap={1.5} fontSize="sm" color="fg.muted">
          <HStack gap={2}>
            <Icon as={MapPin} boxSize={4} flexShrink={0} />
            <Text lineClamp={1}>{turf.address}</Text>
          </HStack>
          <HStack gap={2}>
            <Icon as={Clock} boxSize={4} flexShrink={0} />
            <Text>
              {formatTime12(turf.opening_time)} –{" "}
              {formatTime12(turf.closing_time)}
            </Text>
          </HStack>
        </VStack>

        {/* mt="auto" pins the price row to the bottom so cards line up across the grid */}
        <Flex
          mt="auto"
          pt={4}
          borderTopWidth="1px"
          borderColor={borderColor}
          justify="space-between"
          align="center"
          gap={3}
        >
          {isUnclaimed ? (
            <Text fontSize="xs" color="fg.muted">
              Not bookable yet
            </Text>
          ) : (
            <Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="green.500"
                lineHeight="short"
              >
                {turf.currency} {turf.price_per_slot.toLocaleString()}
              </Text>
              <Text fontSize="xs" color="fg.muted">
                per {turf.slot_duration_minutes} min slot
              </Text>
            </Box>
          )}
          {/* Visual only — the card-wide LinkOverlay owns the click and the tab stop */}
          <HStack
            as="span"
            gap={1}
            flexShrink={0}
            px={3}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="semibold"
            bg="green.subtle"
            color="green.fg"
            transition="background 0.2s, color 0.2s"
            _groupHover={{ bg: "green.solid", color: "green.contrast" }}
          >
            <Text as="span">View Details</Text>
            <Icon
              as={ArrowRight}
              boxSize={4}
              transition="transform 0.2s"
              _groupHover={{ transform: "translateX(2px)" }}
            />
          </HStack>
        </Flex>
      </Flex>
    </LinkBox>
  );
};

/** Placeholder with the same footprint as TurfCard, so the grid doesn't jump on load. */
export const TurfCardSkeleton: React.FC = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      shadow="sm"
    >
      <Skeleton h="180px" />
      <Box p={5}>
        <Skeleton h="5" w="70%" mb={4} />
        <SkeletonText noOfLines={2} gap={3} />
        <Flex
          justify="space-between"
          align="center"
          mt={4}
          pt={4}
          borderTopWidth="1px"
          borderColor={borderColor}
        >
          <Skeleton h="8" w="90px" />
          <Skeleton h="9" w="130px" borderRadius="full" />
        </Flex>
      </Box>
    </Box>
  );
};
