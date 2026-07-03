import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  SimpleGrid,
  Icon,
  Flex,
  Separator,
  Alert,
  Spinner,
} from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import { useColorModeValue } from "../components/ui/color-mode";
import { MapPin, Clock, Calendar, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTurf } from "./useTurfDetailsPage";

interface TimeSlot {
  id: string;
  time: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isUnavailable: boolean;
  isPast: boolean;
}

const TurfDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: turf, isLoading, isError } = useTurf(id!);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);

  const generateAndCheckSlots = useCallback(
    async (date: Date) => {
      if (!turf) return;

      setIsSlotsLoading(true);
      setSelectedSlot(null);

      try {
        // Parse opening and closing times (strip timezone offset)
        const cleanOpen = turf.opening_time.substring(0, 5); // "HH:MM"
        const cleanClose = turf.closing_time.substring(0, 5); // "HH:MM"
        const duration = turf.slot_duration_minutes;

        // Generate slots from opening to closing time
        const slots: TimeSlot[] = [];
        let [openHour, openMin] = cleanOpen.split(":").map(Number);
        const [closeHour, closeMin] = cleanClose.split(":").map(Number);
        const closeTotalMins = closeHour * 60 + closeMin;

        let slotIndex = 1;

        while (true) {
          const startTotalMins = openHour * 60 + openMin;
          const endTotalMins = startTotalMins + duration;

          if (endTotalMins > closeTotalMins) break;

          const endHour = Math.floor(endTotalMins / 60);
          const endMin = endTotalMins % 60;

          const formatTime12 = (h: number, m: number) => {
            const meridiem = h >= 12 ? "PM" : "AM";
            const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
            return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${meridiem}`;
          };

          const formatTime24 = (h: number, m: number) =>
            `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;

          slots.push({
            id: String(slotIndex),
            time: `${formatTime12(openHour, openMin)} - ${formatTime12(endHour, endMin)}`,
            startTime: formatTime24(openHour, openMin),
            endTime: formatTime24(endHour, endMin),
            isBooked: false,
            isUnavailable: false,
            isPast: false,
          });

          openHour = endHour;
          openMin = endMin;
          slotIndex++;
        }

        // Format selected date as YYYY-MM-DD
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        // Fetch bookings and settings in parallel
        const [bookingsRes, settingsRes] = await Promise.all([
          fetch(`http://localhost:3000/api/v1/bookings`),
          fetch(`http://localhost:3000/api/v1/settings`),
        ]);

        const { bookings } = await bookingsRes.json();
        const { settings } = await settingsRes.json();

        // Filter bookings for this turf and selected date
        const turfBookings = bookings.filter(
          (b: any) =>
            b.turf_id === turf.id &&
            b.date === dateStr &&
            b.status !== "cancelled",
        );

        // Filter closed hours for this turf and selected date
        const now = new Date();
        const turfClosedHours = settings.filter((s: any) => {
          if (s.turf_id !== turf.id || s.blocked_date !== dateStr) return false;
          const cleanEnd = (s.blocked_end_time ?? "23:59:59").substring(0, 8);
          const endDateTime = new Date(`${s.blocked_date}T${cleanEnd}`);
          return endDateTime > now;
        });

        // Mark slots as booked or unavailable
        const isToday = date.toDateString() === new Date().toDateString();

        const updatedSlots = slots.map((slot) => {
          const isBooked = turfBookings.some((b: any) => {
            const bStart = b.start_time.substring(0, 8);
            const bEnd = b.end_time.substring(0, 8);
            return bStart < slot.endTime && bEnd > slot.startTime;
          });

          const isUnavailable = turfClosedHours.some((s: any) => {
            const cStart = (s.blocked_start_time ?? "00:00:00").substring(0, 8);
            const cEnd = (s.blocked_end_time ?? "23:59:59").substring(0, 8);
            return cStart < slot.endTime && cEnd > slot.startTime;
          });

          // Only mark as past for today's date
          const isPast = isToday
            ? new Date(`${dateStr}T${slot.endTime}`) < new Date()
            : false;

          return { ...slot, isBooked, isUnavailable, isPast };
        });

        setTimeSlots(updatedSlots);
      } catch (error) {
        console.error("Failed to generate slots:", error);
      } finally {
        setIsSlotsLoading(false);
      }
    },
    [turf],
  );

  useEffect(() => {
    if (turf) {
      generateAndCheckSlots(selectedDate);
    }
  }, [turf, selectedDate, generateAndCheckSlots]);

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const pageBg = useColorModeValue("gray.50", "gray.800");

  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="green.500" />
      </Flex>
    );
  }

  if (isError || !turf) {
    return (
      <Flex justify="center" align="center" minH="100vh" px={4}>
        <Alert.Root status="error" borderRadius="lg" maxW="md">
          <Alert.Description>
            Failed to load turf details. Please try again later.
          </Alert.Description>
        </Alert.Root>
      </Flex>
    );
  }

  const handleContinueBooking = () => {
    if (!selectedSlot) {
      toaster.warning({
        title: "Please select a time slot",
        duration: 3000,
        closable: true,
      });
      return;
    }

    navigate(`/booking-form/${turf.id}`, {
      state: {
        turfId: turf.id,
        turfName: turf.name,
        turfImage:
          "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=200&fit=crop",
        location: turf.address,
        date: selectedDate.toDateString(),
        timeSlot: timeSlots.find((s) => s.id === selectedSlot)?.time,
        duration: `${turf.slot_duration_minutes} minutes`,
        pricePerSlot: turf.price_per_slot,
        currency: turf.currency,
      },
    });
  };

  return (
    <Box minH="100vh" bg={pageBg}>
      {/* Banner Image */}
      <Box
        position="relative"
        h={{ base: "250px", md: "400px" }}
        overflow="hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&h=400&fit=crop"
          alt={turf.name}
          w="100%"
          h="100%"
          objectFit="cover"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.400"
        />
        <Container maxW="container.xl" position="relative" h="100%">
          <Flex align="flex-end" h="100%" pb={8}>
            <Badge
              colorPalette="blue"
              fontSize="md"
              px={4}
              py={2}
              borderRadius="full"
            >
              {turf.type}
            </Badge>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Turf Info Section */}
          <Box bg={cardBg} p={{ base: 6, md: 8 }} borderRadius="xl" shadow="sm">
            <VStack align="stretch" gap={4}>
              <Flex
                justify="space-between"
                align="flex-start"
                flexWrap="wrap"
                gap={4}
              >
                <Box flex="1">
                  <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={3}>
                    {turf.name}
                  </Heading>
                  <HStack gap={4} flexWrap="wrap" mb={3}>
                    <HStack color="gray.600">
                      <Icon as={MapPin} />
                      <Text fontSize="md">{turf.address}</Text>
                    </HStack>
                    <HStack color="gray.600">
                      <Icon as={Clock} />
                      <Text fontSize="md">
                        {turf.opening_time} - {turf.closing_time}
                      </Text>
                    </HStack>
                  </HStack>
                </Box>
                <Box textAlign={{ base: "left", md: "right" }}>
                  <Text fontSize="3xl" fontWeight="bold" color="green.500">
                    {turf.currency} {turf.price_per_slot}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    per slot
                  </Text>
                </Box>
              </Flex>

              <Separator />

              <Box>
                <Heading as="h3" size="sm" mb={3}>
                  Slot Duration
                </Heading>
                <Badge
                  colorPalette="green"
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                >
                  {turf.slot_duration_minutes} minutes per slot
                </Badge>
              </Box>
            </VStack>
          </Box>

          {/* Date Selection */}
          <Box bg={cardBg} p={{ base: 6, md: 8 }} borderRadius="xl" shadow="sm">
            <VStack align="stretch" gap={6}>
              <HStack>
                <Icon as={Calendar} color="green.500" boxSize={6} />
                <Heading as="h2" size="lg">
                  Select Date
                </Heading>
              </HStack>

              <SimpleGrid columns={{ base: 7 }} gap={3}>
                {dates.map((date, index) => {
                  const { day, date: dateNum, month } = formatDate(date);
                  const isSelected = isSameDate(date, selectedDate);
                  const isTodayDate = isToday(date);

                  return (
                    <VStack
                      key={index}
                      p={3}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={isSelected ? "green.500" : borderColor}
                      bg={isSelected ? "green.50" : "transparent"}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: "green.400", bg: hoverBg }}
                      onClick={() => setSelectedDate(date)}
                      gap={1}
                    >
                      <Text fontSize="xs" fontWeight="medium" color="gray.600">
                        {day}
                      </Text>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={isSelected ? "green.600" : "gray.800"}
                      >
                        {dateNum}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {month}
                      </Text>
                      {isTodayDate && (
                        <Badge colorPalette="green" fontSize="2xs">
                          Today
                        </Badge>
                      )}
                    </VStack>
                  );
                })}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Time Slot Selection */}
          <Box bg={cardBg} p={{ base: 6, md: 8 }} borderRadius="xl" shadow="sm">
            <VStack align="stretch" gap={6}>
              <HStack justify="space-between" flexWrap="wrap">
                <HStack>
                  <Icon as={Clock} color="green.500" boxSize={6} />
                  <Heading as="h2" size="lg">
                    Select Time Slot
                  </Heading>
                </HStack>
                <HStack gap={4} fontSize="sm" flexWrap="wrap">
                  <HStack>
                    <Box w={4} h={4} bg="green.500" borderRadius="sm" />
                    <Text>Available</Text>
                  </HStack>
                  <HStack>
                    <Box w={4} h={4} bg="gray.300" borderRadius="sm" />
                    <Text>Booked</Text>
                  </HStack>
                  <HStack>
                    <Box w={4} h={4} bg="red.400" borderRadius="sm" />
                    <Text>Not Available</Text>
                  </HStack>
                  <HStack>
                    <Box w={4} h={4} bg="orange.300" borderRadius="sm" />
                    <Text>Expired</Text>
                  </HStack>
                  <HStack>
                    <Icon as={CheckCircle} color="green.600" boxSize={4} />
                    <Text>Selected</Text>
                  </HStack>
                </HStack>
              </HStack>

              {isSlotsLoading ? (
                <Flex justify="center" py={8}>
                  <Spinner size="lg" color="green.500" />
                </Flex>
              ) : (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={3}>
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.id;
                    const isDisabled =
                      slot.isBooked || slot.isUnavailable || slot.isPast;

                    return (
                      <Button
                        key={slot.id}
                        variant={isSelected ? "solid" : "outline"}
                        colorPalette={
                          slot.isPast
                            ? "orange"
                            : slot.isUnavailable
                              ? "red"
                              : slot.isBooked
                                ? "gray"
                                : "green"
                        }
                        disabled={isDisabled}
                        onClick={() => !isDisabled && setSelectedSlot(slot.id)}
                        h="60px"
                        position="relative"
                        borderWidth="2px"
                        _disabled={{
                          opacity: 0.6,
                          cursor: "not-allowed",
                        }}
                      >
                        <VStack gap={0}>
                          <Text fontSize="sm" fontWeight="semibold">
                            {slot.time}
                          </Text>
                          {slot.isPast && <Text fontSize="xs">Expired</Text>}
                          {!slot.isPast && slot.isUnavailable && (
                            <Text fontSize="xs">Not Available</Text>
                          )}
                          {!slot.isPast &&
                            !slot.isUnavailable &&
                            slot.isBooked && <Text fontSize="xs">Booked</Text>}
                        </VStack>
                        {isSelected && (
                          <Icon
                            as={CheckCircle}
                            position="absolute"
                            top={2}
                            right={2}
                            boxSize={4}
                          />
                        )}
                      </Button>
                    );
                  })}
                </SimpleGrid>
              )}
            </VStack>
          </Box>

          {/* Booking Summary & CTA */}
          <Box bg={cardBg} p={{ base: 6, md: 8 }} borderRadius="xl" shadow="sm">
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "stretch", md: "center" }}
              gap={4}
            >
              <VStack align="flex-start" gap={2}>
                <Heading as="h3" size="md">
                  Booking Summary
                </Heading>
                <Text color="gray.600">
                  Date: <strong>{selectedDate.toDateString()}</strong>
                </Text>
                {selectedSlot && (
                  <Text color="gray.600">
                    Time:{" "}
                    <strong>
                      {timeSlots.find((s) => s.id === selectedSlot)?.time}
                    </strong>
                  </Text>
                )}
                <Text color="gray.600">
                  Price:{" "}
                  <Text
                    as="span"
                    color="green.500"
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    {turf.currency} {turf.price_per_slot}
                  </Text>
                </Text>
              </VStack>
              {/* <Link to={`/booking-form/${turf.id}`}> */}
              <Button
                colorPalette="green"
                size="lg"
                px={12}
                py={6}
                fontSize="lg"
                borderRadius="full"
                onClick={handleContinueBooking}
                disabled={!selectedSlot}
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                transition="all 0.2s"
              >
                Continue to Booking
              </Button>
              {/* </Link> */}
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TurfDetailsPage;
