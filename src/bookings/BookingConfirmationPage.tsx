import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Separator,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { Card, CardBody } from "@chakra-ui/card";
import {
  CheckCircle,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Hash,
  Download,
  Share2,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toaster } from "../components/ui/toaster";
import { APP_BASE_URL } from "../utils/api";
import { decodeSlots, sortSlots } from "./bookingSlots";

const BookingConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isCreating, setIsCreating] = useState(true);
  const [createdBookingIds, setCreatedBookingIds] = useState<number[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);

  const slots = sortSlots(decodeSlots(searchParams.get("slots")));
  const slotDurationMinutes = Number(searchParams.get("slotDuration") ?? 60);
  const pricePerSlot = Number(searchParams.get("pricePerSlot") ?? 0);

  const cardBg = useColorModeValue("white", "gray.700");
  const successBg = useColorModeValue("green.50", "green.900");
  const successColor = useColorModeValue("green.600", "green.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const basketId = searchParams.get("BASKET_ID") ?? "";

  useEffect(() => {
    const createBookingAfterPayment = async () => {
      // Prevent duplicate booking creation on refresh, using PayFast's unique BASKET_ID
      const storageKey = `booking_created_${basketId}`;
      const alreadyCreated = sessionStorage.getItem(storageKey);

      if (alreadyCreated) {
        try {
          setCreatedBookingIds(JSON.parse(alreadyCreated));
        } catch {
          setCreatedBookingIds([]);
        }
        setIsCreating(false);
        return;
      }

      try {
        if (slots.length === 0) {
          throw new Error("No time slots were found for this booking.");
        }

        // Step 1: Resolve the client — reuse the logged-in client's existing
        // record instead of creating a new one every time, so bookings stay
        // correctly linked to the account for past-booking tracking.
        let clientId: number | null = null;

        const storedClient = localStorage.getItem("client");
        const isClientLoggedIn =
          localStorage.getItem("isClientLoggedIn") === "true";

        if (isClientLoggedIn && storedClient) {
          try {
            const parsedClient = JSON.parse(storedClient);
            clientId = parsedClient?.id ?? null;
          } catch {
            clientId = null;
          }
        }

        if (!clientId) {
          // Guest checkout (or corrupted/missing session): fall back to
          // creating a new client record as before.
          const clientRes = await fetch(`${APP_BASE_URL}/clients`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: searchParams.get("fullName") ?? "",
              phone: searchParams.get("phoneNumber") ?? "",
              email: searchParams.get("email")?.trim() || null,
            }),
          });

          if (!clientRes.ok) {
            const err = await clientRes.json();
            throw new Error(err?.error?.message ?? "Failed to create client");
          }

          const { client } = await clientRes.json();
          clientId = client.id;
        }

        // Step 2: Create one booking per selected slot, in a single request so
        // an unavailable slot rejects the whole set instead of half-booking it.
        const bookingRes = await fetch(`${APP_BASE_URL}/bookings/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: clientId,
            turf_id: searchParams.get("turfId"),
            date: searchParams.get("date"),
            slots: slots.map((slot) => ({
              start_time: slot.startTime,
              end_time: slot.endTime,
              duration_minutes: slotDurationMinutes,
              price: pricePerSlot,
            })),
            status: "confirmed",
            payment_method: "card",
            payment_status: "paid",
            payment_transaction_id: basketId || null,
          }),
        });

        if (!bookingRes.ok) {
          const err = await bookingRes.json();
          const message =
            typeof err?.error === "string"
              ? err.error
              : (err?.error?.message ?? "Failed to create booking");
          throw new Error(message);
        }

        const { bookings } = await bookingRes.json();
        const ids = bookings.map((b: { id: number }) => b.id);

        sessionStorage.setItem(storageKey, JSON.stringify(ids));
        setCreatedBookingIds(ids);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while saving your booking.";
        setCreateError(message);
        toaster.error({
          title: "Booking Save Failed",
          description: message,
          duration: 6000,
          closable: true,
        });
      } finally {
        setIsCreating(false);
      }
    };

    createBookingAfterPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookingData = {
    bookingIds: createdBookingIds.map((id) => `TK-${id}`),
    turfName: searchParams.get("turfName") ?? "—",
    location: searchParams.get("location") ?? "—",
    date: searchParams.get("displayDate") ?? "—",
    slots,
    totalDuration: slotDurationMinutes * slots.length,
    customerName: searchParams.get("fullName") ?? "—",
    phoneNumber: searchParams.get("phoneNumber") ?? "—",
    amountPaid: pricePerSlot * slots.length,
    currency: searchParams.get("currency") ?? "Rs",
    bookingDate: new Date().toLocaleString(),
  };

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt");
  };

  const handleShareBooking = () => {
    console.log("Sharing booking details");
  };

  if (isCreating) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        <VStack gap={4}>
          <Spinner size="xl" color="green.500" />
          <Text color="gray.600">Confirming your booking...</Text>
        </VStack>
      </Box>
    );
  }

  if (createError) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue("gray.50", "gray.900")}
        px={4}
      >
        <VStack gap={4} textAlign="center" maxW="md">
          <Icon as={CreditCard} boxSize={12} color="red.500" />
          <Heading size="md" color="red.500">
            Payment Received, But Booking Failed to Save
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {createError}
          </Text>
          <Text color="gray.600" fontSize="sm">
            Your payment was successful, but we couldn't save your booking
            automatically. Please contact support with your transaction ID:{" "}
            <strong>{basketId}</strong>
          </Text>
          <Link to="/">
            <Button colorScheme="green" mt={2}>
              Go to Home
            </Button>
          </Link>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      py={{ base: 8, md: 16 }}
    >
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          {/* Success Icon Section */}
          <VStack gap={6} textAlign="center">
            <Box
              bg={successBg}
              borderRadius="full"
              p={6}
              display="inline-flex"
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: "-10px",
                left: "-10px",
                right: "-10px",
                bottom: "-10px",
                borderRadius: "full",
                border: "2px solid",
                borderColor: successColor,
                opacity: 0.2,
              }}
            >
              <Icon
                as={CheckCircle}
                boxSize={{ base: 16, md: 20 }}
                color={successColor}
              />
            </Box>

            <VStack gap={2}>
              <Heading
                as="h1"
                size={{ base: "xl", md: "2xl" }}
                color={successColor}
              >
                Booking Confirmed!
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
                {bookingData.slots.length > 1
                  ? `Your turf has been successfully reserved for ${bookingData.slots.length} slots`
                  : "Your turf has been successfully reserved"}
              </Text>
            </VStack>

            {/* Booking ID Badges — one per reserved slot */}
            <HStack gap={3} flexWrap="wrap" justify="center">
              {(bookingData.bookingIds.length > 0
                ? bookingData.bookingIds
                : ["—"]
              ).map((bookingId) => (
                <Badge
                  key={bookingId}
                  colorScheme="green"
                  fontSize={{ base: "md", md: "lg" }}
                  px={6}
                  py={3}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={Hash} boxSize={5} />
                  <Text fontWeight="bold">{bookingId}</Text>
                </Badge>
              ))}
            </HStack>
          </VStack>

          {/* Booking Details Card */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl">
            <CardBody p={{ base: 6, md: 8 }}>
              <VStack gap={6} align="stretch">
                <Heading as="h2" size="md" textAlign="center">
                  Booking Details
                </Heading>

                <Separator />

                {/* Turf Information */}
                <Box>
                  <Heading as="h3" size="sm" mb={3}>
                    {bookingData.turfName}
                  </Heading>
                  <HStack color="gray.600">
                    <Icon as={MapPin} boxSize={4} />
                    <Text fontSize="sm">{bookingData.location}</Text>
                  </HStack>
                </Box>

                <Separator />

                {/* Date and Time */}
                <VStack gap={4} align="stretch">
                  <HStack
                    justify="space-between"
                    p={3}
                    bg={useColorModeValue("gray.50", "gray.800")}
                    borderRadius="md"
                  >
                    <HStack color="gray.600">
                      <Icon as={Calendar} boxSize={5} color={successColor} />
                      <Text fontWeight="medium">Date</Text>
                    </HStack>
                    <Text
                      fontWeight="semibold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {bookingData.date}
                    </Text>
                  </HStack>

                  <HStack
                    justify="space-between"
                    align="start"
                    p={3}
                    bg={useColorModeValue("gray.50", "gray.800")}
                    borderRadius="md"
                  >
                    <HStack color="gray.600">
                      <Icon as={Clock} boxSize={5} color={successColor} />
                      <Text fontWeight="medium">
                        {bookingData.slots.length === 1
                          ? "Time Slot"
                          : `Time Slots (${bookingData.slots.length})`}
                      </Text>
                    </HStack>
                    <VStack align="end" gap={1}>
                      {bookingData.slots.map((slot) => (
                        <Text
                          key={slot.startTime}
                          fontWeight="semibold"
                          fontSize={{ base: "sm", md: "md" }}
                        >
                          {slot.time}
                        </Text>
                      ))}
                    </VStack>
                  </HStack>
                </VStack>

                <Separator />

                {/* Customer Information */}
                <VStack gap={3} align="stretch">
                  <Heading as="h3" size="sm">
                    Customer Information
                  </Heading>
                  <HStack justify="space-between">
                    <Text color="gray.600" fontSize="sm">
                      Name
                    </Text>
                    <Text fontWeight="medium" fontSize="sm">
                      {bookingData.customerName}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600" fontSize="sm">
                      Phone
                    </Text>
                    <Text fontWeight="medium" fontSize="sm">
                      {bookingData.phoneNumber}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600" fontSize="sm">
                      Total Duration
                    </Text>
                    <Text fontWeight="medium" fontSize="sm">
                      {bookingData.totalDuration} minutes
                    </Text>
                  </HStack>
                </VStack>

                <Separator />

                {/* Amount Paid */}
                <Box
                  p={4}
                  bg={successBg}
                  borderRadius="lg"
                  borderWidth="2px"
                  borderColor={successColor}
                >
                  <HStack justify="space-between" align="center">
                    <HStack>
                      <Icon as={CreditCard} boxSize={6} color={successColor} />
                      <Text fontSize="lg" fontWeight="semibold">
                        Amount to Pay
                      </Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color={successColor}>
                      {bookingData.currency}{" "}
                      {bookingData.amountPaid.toLocaleString()}
                    </Text>
                  </HStack>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    mt={2}
                    textAlign="center"
                  >
                    Payment will be collected at the venue
                  </Text>
                </Box>

                <Separator />

                {/* Additional Info */}
                <Box
                  p={4}
                  bg={useColorModeValue("blue.50", "blue.900")}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Text
                    fontSize="sm"
                    color="gray.700"
                    fontWeight="semibold"
                    mb={2}
                  >
                    Important Information:
                  </Text>
                  <VStack
                    align="stretch"
                    gap={1}
                    fontSize="sm"
                    color="gray.600"
                  >
                    <Text>
                      • Please arrive 10 minutes before your booking time
                    </Text>
                    <Text>• Bring a valid ID for verification</Text>
                    <Text>• Contact us for any changes or cancellations</Text>
                    <Text>
                      • Free cancellation up to 2 hours before booking
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <VStack gap={3}>
            <Link to="/" style={{ width: "100%", display: "block" }}>
              <Button
                colorScheme="green"
                size="lg"
                w="100%"
                py={6}
                fontSize="lg"
                borderRadius="full"
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                transition="all 0.2s"
              >
                Go to Home
              </Button>
            </Link>
            <HStack w="100%" gap={3}>
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                colorScheme="green"
                size="md"
                flex={1}
                borderRadius="full"
              >
                <Icon as={Download} />
                Download Receipt
              </Button>

              <Button
                onClick={handleShareBooking}
                variant="outline"
                colorScheme="green"
                size="md"
                flex={1}
                borderRadius="full"
              >
                Share Booking
                <Icon as={Share2} />
              </Button>
            </HStack>
          </VStack>

          {/* Footer Text */}
          <VStack gap={2} textAlign="center" pt={4}>
            <Text fontSize="sm" color="gray.600">
              Booked on {bookingData.bookingDate}
            </Text>
            <Text fontSize="xs" color="gray.500">
              A confirmation has been sent to your phone number
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default BookingConfirmationPage;
