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
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { Card, CardBody } from "@chakra-ui/card";
import {
  XCircle,
  Calendar,
  Clock,
  MapPin,
  RefreshCcw,
  Home,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const BookingFailurePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const cardBg = useColorModeValue("white", "gray.700");
  const failureBg = useColorModeValue("red.50", "red.900");
  const failureColor = useColorModeValue("red.600", "red.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const failureData = {
    turfId: searchParams.get("turfId") ?? null,
    basketId: searchParams.get("BASKET_ID") ?? "—",
    turfName: searchParams.get("turfName") ?? "—",
    location: searchParams.get("location") ?? "—",
    date: searchParams.get("date") ?? "—",
    timeSlot: searchParams.get("timeSlot") ?? "—",
    duration: searchParams.get("duration") ?? "—",
    customerName: searchParams.get("customerName") ?? "—",
    phoneNumber: searchParams.get("phoneNumber") ?? "—",
    amountToPay: Number(searchParams.get("amountToPay")) ?? 0,
    currency: searchParams.get("currency") ?? "PKR",
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      py={{ base: 8, md: 16 }}
    >
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          {/* Failure Icon Section */}
          <VStack gap={6} textAlign="center">
            <Box
              bg={failureBg}
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
                borderColor: failureColor,
                opacity: 0.2,
              }}
            >
              <Icon
                as={XCircle}
                boxSize={{ base: 16, md: 20 }}
                color={failureColor}
              />
            </Box>

            <VStack gap={2}>
              <Heading
                as="h1"
                size={{ base: "xl", md: "2xl" }}
                color={failureColor}
              >
                Payment Failed!
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
                Unfortunately your transaction could not be completed
              </Text>
            </VStack>
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
                    {failureData.turfName}
                  </Heading>
                  <HStack color="gray.600">
                    <Icon as={MapPin} boxSize={4} />
                    <Text fontSize="sm">{failureData.location}</Text>
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
                      <Icon as={Calendar} boxSize={5} color={failureColor} />
                      <Text fontWeight="medium">Date</Text>
                    </HStack>
                    <Text
                      fontWeight="semibold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {failureData.date}
                    </Text>
                  </HStack>

                  <HStack
                    justify="space-between"
                    p={3}
                    bg={useColorModeValue("gray.50", "gray.800")}
                    borderRadius="md"
                  >
                    <HStack color="gray.600">
                      <Icon as={Clock} boxSize={5} color={failureColor} />
                      <Text fontWeight="medium">Time Slot</Text>
                    </HStack>
                    <Text
                      fontWeight="semibold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {failureData.timeSlot}
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
                      {failureData.customerName}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600" fontSize="sm">
                      Phone
                    </Text>
                    <Text fontWeight="medium" fontSize="sm">
                      {failureData.phoneNumber}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600" fontSize="sm">
                      Duration
                    </Text>
                    <Text fontWeight="medium" fontSize="sm">
                      {failureData.duration}
                    </Text>
                  </HStack>
                </VStack>

                <Separator />

                {/* Amount */}
                <Box
                  p={4}
                  bg={failureBg}
                  borderRadius="lg"
                  borderWidth="2px"
                  borderColor={failureColor}
                >
                  <HStack justify="space-between" align="center">
                    <HStack>
                      <Icon as={XCircle} boxSize={6} color={failureColor} />
                      <Text fontSize="lg" fontWeight="semibold">
                        Amount
                      </Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color={failureColor}>
                      {failureData.currency}{" "}
                      {failureData.amountToPay.toLocaleString()}
                    </Text>
                  </HStack>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    mt={2}
                    textAlign="center"
                  >
                    No amount has been deducted from your account
                  </Text>
                </Box>

                <Separator />

                {/* Reason Box */}
                <Box
                  p={4}
                  bg={useColorModeValue("orange.50", "orange.900")}
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
                    Possible Reasons for Failure:
                  </Text>
                  <VStack
                    align="stretch"
                    gap={1}
                    fontSize="sm"
                    color="gray.600"
                  >
                    <Text>• Insufficient balance in your account</Text>
                    <Text>• Incorrect card details entered</Text>
                    <Text>• Transaction timed out</Text>
                    <Text>• Bank declined the transaction</Text>
                    <Text>• Network issue during payment</Text>
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <VStack gap={3}>
            {/* Try Again Button */}
            <Link
              to={`/booking-form/${failureData.turfId}`}
              state={{
                turfId: failureData.turfId,
                turfName: failureData.turfName,
                location: failureData.location,
                date: failureData.date,
                timeSlot: failureData.timeSlot,
                duration: failureData.duration,
                pricePerSlot: failureData.amountToPay,
                currency: failureData.currency,
              }}
              style={{ width: "100%", display: "block" }}
            >
              <Button
                colorScheme="red"
                size="lg"
                w="100%"
                py={6}
                fontSize="lg"
                borderRadius="full"
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                transition="all 0.2s"
              >
                <Icon as={RefreshCcw} mr={2} />
                Try Again
              </Button>
            </Link>

            {/* Go Home Button */}
            <Link to="/" style={{ width: "100%", display: "block" }}>
              <Button
                variant="outline"
                colorScheme="red"
                size="lg"
                w="100%"
                py={6}
                fontSize="lg"
                borderRadius="full"
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                transition="all 0.2s"
              >
                <Icon as={Home} mr={2} />
                Go to Home
              </Button>
            </Link>
          </VStack>

          {/* Footer Text */}
          <VStack gap={2} textAlign="center" pt={4}>
            <Text fontSize="sm" color="gray.600">
              If the issue persists, please contact our support team
            </Text>
            <Text fontSize="xs" color="gray.500">
              No booking has been confirmed until payment is successful
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default BookingFailurePage;
