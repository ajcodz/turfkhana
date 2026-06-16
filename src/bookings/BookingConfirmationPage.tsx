import React from "react";
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
import { Link, useLocation, useSearchParams } from "react-router-dom";

interface ConfirmationState {
  bookingId: number;
  turfName: string;
  location: string;
  date: string;
  timeSlot: string;
  duration: string;
  customerName: string;
  phoneNumber: string;
  amountToPay: number;
  currency: string;
  bookedAt: string;
}

const BookingConfirmationPage: React.FC = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const data = state as ConfirmationState | null;

  const cardBg = useColorModeValue("white", "gray.700");
  const successBg = useColorModeValue("green.50", "green.900");
  const successColor = useColorModeValue("green.600", "green.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Mock booking confirmation data
  const bookingData = {
    bookingId: data?.bookingId
      ? `TK-${data.bookingId}`
      : (searchParams.get("BASKET_ID") ?? "—"),
    turfName: data?.turfName ?? searchParams.get("MERCHANT_NAME") ?? "—",
    location: data?.location ?? "—",
    date: data?.date ?? "—",
    timeSlot: data?.timeSlot ?? "—",
    duration: data?.duration ?? "—",
    customerName:
      data?.customerName ?? searchParams.get("CUSTOMER_EMAIL_ADDRESS") ?? "—",
    phoneNumber:
      data?.phoneNumber ?? searchParams.get("CUSTOMER_MOBILE_NO") ?? "—",
    amountPaid: data?.amountToPay ?? Number(searchParams.get("TXNAMT")) ?? 0,
    currency: data?.currency ?? searchParams.get("CURRENCY_CODE") ?? "Rs",
    bookingDate: data?.bookedAt ?? new Date().toLocaleString(),
  };

  const handleGoHome = () => {
    console.log("Navigating to home page");
    // Navigation logic here
  };

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt");
    // Download logic here
  };

  const handleShareBooking = () => {
    console.log("Sharing booking details");
    // Share logic here
  };

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
                Your turf has been successfully reserved
              </Text>
            </VStack>

            {/* Booking ID Badge */}
            <Badge
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
              <Text fontWeight="bold">{bookingData.bookingId}</Text>
            </Badge>
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
                    p={3}
                    bg={useColorModeValue("gray.50", "gray.800")}
                    borderRadius="md"
                  >
                    <HStack color="gray.600">
                      <Icon as={Clock} boxSize={5} color={successColor} />
                      <Text fontWeight="medium">Time Slot</Text>
                    </HStack>
                    <Text
                      fontWeight="semibold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {bookingData.timeSlot}
                    </Text>
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
                      Duration
                    </Text>
                    <Text fontWeight="medium" fontSize="sm">
                      {bookingData.duration}
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
                onClick={handleGoHome}
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
