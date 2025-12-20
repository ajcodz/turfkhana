import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Icon,
  Image,
  Separator,
  Field,
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

interface BookingFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
}

const BookingFormPage: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const summaryBg = useColorModeValue("green.50", "gray.800");

  // Mock booking data
  const bookingData = {
    id: 1,
    turfName: "Premier Cricket Ground",
    turfImage:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=200&fit=crop",
    location: "Model Town, Lahore",
    date: "Wednesday, December 4, 2025",
    timeSlot: "06:00 PM - 07:00 PM",
    duration: "1 hour",
    pricePerHour: 2500,
    totalPrice: 2500,
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{11}$/.test(formData.phoneNumber.replace(/\s|-/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 11-digit phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toaster.error({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        duration: 3000,
        closable: true,
      });
      // toast({
      //   title: 'Validation Error',
      //   description: 'Please fix the errors in the form',
      //   status: 'error',
      //   duration: 3000,
      //   isClosable: true,
      // });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toaster.success({
        title: "Booking Confirmed!",
        description:
          "Your turf has been successfully booked. You will receive a confirmation shortly.",
        duration: 5000,
        closable: true,
      });
      // toast({
      //   title: 'Booking Confirmed!',
      //   description: 'Your turf has been successfully booked. You will receive a confirmation shortly.',
      //   status: 'success',
      //   duration: 5000,
      //   isClosable: true,
      // });

      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
      });
    }, 1500);
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      py={{ base: 6, md: 12 }}
    >
      <Container maxW="container.xl">
        <VStack gap={6} align="stretch">
          {/* Page Header */}
          <Box>
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={2}>
              Complete Your Booking
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Just a few more details to confirm your turf reservation
            </Text>
          </Box>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 400px" }} gap={6}>
            {/* Form Section */}
            <GridItem>
              <Box
                bg={cardBg}
                p={{ base: 6, md: 8 }}
                borderRadius="xl"
                shadow="sm"
              >
                <form onSubmit={handleSubmit}>
                  <VStack gap={6} align="stretch">
                    <Box>
                      <Heading as="h2" size="md" mb={4}>
                        Personal Information
                      </Heading>
                      <Text color="gray.600" fontSize="sm" mb={6}>
                        Please provide your contact details for booking
                        confirmation
                      </Text>
                    </Box>

                    {/* Full Name */}
                    <Field.Root required invalid={!!errors.fullName}>
                      <Field.Label>
                        <HStack>
                          <Icon as={User} boxSize={4} />
                          <Text>Full Name</Text>
                        </HStack>
                      </Field.Label>
                      <Input
                        placeholder="Enter your full name"
                        size="lg"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        borderColor={borderColor}
                        _focus={{
                          borderColor: "green.500",
                          boxShadow: "0 0 0 1px #38A169",
                        }}
                      />
                      <Field.ErrorText>{errors.fullName}</Field.ErrorText>
                    </Field.Root>

                    {/* Phone Number */}
                    <Field.Root required invalid={!!errors.phoneNumber}>
                      <Field.Label>
                        <HStack>
                          <Icon as={Phone} boxSize={4} />
                          <Text>Phone Number</Text>
                        </HStack>
                      </Field.Label>
                      <Input
                        placeholder="03XX-XXXXXXX"
                        size="lg"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        borderColor={borderColor}
                        _focus={{
                          borderColor: "green.500",
                          boxShadow: "0 0 0 1px #38A169",
                        }}
                      />
                      <Field.ErrorText>{errors.phoneNumber}</Field.ErrorText>
                    </Field.Root>

                    {/* Email (Optional) */}
                    <Field.Root invalid={!!errors.email}>
                      <Field.Label>
                        <HStack>
                          <Icon as={Mail} boxSize={4} />
                          <Text>Email Address</Text>
                          <Text fontSize="sm" color="gray.500">
                            (Optional)
                          </Text>
                        </HStack>
                      </Field.Label>
                      <Input
                        placeholder="your.email@example.com"
                        size="lg"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        borderColor={borderColor}
                        _focus={{
                          borderColor: "green.500",
                          boxShadow: "0 0 0 1px #38A169",
                        }}
                      />
                      <Field.ErrorText>{errors.email}</Field.ErrorText>
                    </Field.Root>

                    <Separator />

                    {/* Payment Note */}
                    <Box
                      p={4}
                      bg={summaryBg}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="green.200"
                    >
                      <HStack mb={2}>
                        <Icon as={CreditCard} color="green.600" boxSize={5} />
                        <Heading as="h3" size="sm" color="green.700">
                          Payment Information
                        </Heading>
                      </HStack>
                      <Text fontSize="sm" color="gray.700">
                        Payment will be collected at the venue. Please bring
                        cash or use our on-site card payment facility.
                      </Text>
                    </Box>

                    {/* Submit Button */}
                    <Link to={`/booking-confirmation/${bookingData.id}`}>
                      <Button
                        type="submit"
                        colorScheme="green"
                        size="lg"
                        w="100%"
                        py={6}
                        fontSize="lg"
                        loading={isSubmitting}
                        loadingText="Processing..."
                        _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                        transition="all 0.2s"
                      >
                        Confirm Booking
                      </Button>
                    </Link>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      By confirming, you agree to our Terms of Service and
                      Cancellation Policy
                    </Text>
                  </VStack>
                </form>
              </Box>
            </GridItem>

            {/* Summary Sidebar */}
            <GridItem>
              <Box
                bg={cardBg}
                p={6}
                borderRadius="xl"
                shadow="sm"
                position={{ lg: "sticky" }}
                top={{ lg: 6 }}
              >
                <VStack gap={5} align="stretch">
                  <Heading as="h2" size="md">
                    Booking Summary
                  </Heading>

                  {/* Turf Image */}
                  <Box borderRadius="lg" overflow="hidden">
                    <Image
                      src={bookingData.turfImage}
                      alt={bookingData.turfName}
                      w="100%"
                      h="150px"
                      objectFit="cover"
                    />
                  </Box>

                  {/* Turf Name */}
                  <Box>
                    <Heading as="h3" size="sm" mb={2}>
                      {bookingData.turfName}
                    </Heading>
                    <HStack color="gray.600" fontSize="sm">
                      <Icon as={MapPin} boxSize={4} />
                      <Text>{bookingData.location}</Text>
                    </HStack>
                  </Box>

                  <Separator />

                  {/* Booking Details */}
                  <VStack gap={3} align="stretch">
                    <HStack justify="space-between">
                      <HStack color="gray.600">
                        <Icon as={Calendar} boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium">
                          Date
                        </Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="semibold">
                        {bookingData.date}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack color="gray.600">
                        <Icon as={Clock} boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium">
                          Time
                        </Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="semibold">
                        {bookingData.timeSlot}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Duration
                      </Text>
                      <Text fontSize="sm" fontWeight="semibold">
                        {bookingData.duration}
                      </Text>
                    </HStack>
                  </VStack>

                  <Separator />

                  {/* Price Breakdown */}
                  <VStack gap={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Price per hour
                      </Text>
                      <Text fontSize="sm">
                        Rs {bookingData.pricePerHour.toLocaleString()}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Duration
                      </Text>
                      <Text fontSize="sm">{bookingData.duration}</Text>
                    </HStack>

                    <Separator />

                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">
                        Total Amount
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.500">
                        Rs {bookingData.totalPrice.toLocaleString()}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Additional Info */}
                  <Box
                    p={3}
                    bg={summaryBg}
                    borderRadius="md"
                    fontSize="xs"
                    color="gray.600"
                  >
                    <Text fontWeight="semibold" mb={1}>
                      Cancellation Policy:
                    </Text>
                    <Text>
                      Free cancellation up to 2 hours before booking time. 50%
                      refund after that.
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default BookingFormPage;
