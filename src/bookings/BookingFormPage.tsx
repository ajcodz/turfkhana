import React, { useState, useEffect } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { APP_BASE_URL } from "../utils/api";
import {
  encodeSlots,
  sortSlots,
  type BookingLocationState,
} from "./bookingSlots";

interface BookingFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface StoredClient {
  id: number;
  name: string;
  phone: string;
  email: string | null;
}

const getStoredClient = (): StoredClient | null => {
  const isClientLoggedIn = localStorage.getItem("isClientLoggedIn") === "true";
  if (!isClientLoggedIn) return null;

  const raw = localStorage.getItem("client");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredClient;
  } catch {
    return null;
  }
};

const BookingFormPage: React.FC = () => {
  const storedClient = getStoredClient();

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: storedClient?.name ?? "",
    phoneNumber: storedClient?.phone ?? "",
    email: storedClient?.email ?? "",
  });
  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const summaryBg = useColorModeValue("green.50", "gray.800");
  const pageBg = useColorModeValue("gray.50", "gray.900");

  const location = useLocation();
  const state = location.state as BookingLocationState | null;

  const navigate = useNavigate();

  const slots = sortSlots(state?.slots ?? []);

  const isStateValid = !!(state?.turfId && slots.length > 0 && state?.date);

  useEffect(() => {
    if (!isStateValid) {
      toaster.error({
        title: "Booking details missing",
        description: "Please select a turf and time slot to continue.",
        duration: 4000,
        closable: true,
      });
      navigate("/", { replace: true });
    }
  }, [isStateValid, navigate]);

  const pricePerSlot = state?.pricePerSlot ?? 0;
  const slotDurationMinutes = state?.slotDurationMinutes ?? 60;

  const bookingData = {
    turfName: state?.turfName ?? "—",
    turfImage:
      state?.turfImage ??
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=200&fit=crop",
    location: state?.location ?? "—",
    date: state?.date ?? "—",
    slots,
    slotDurationMinutes,
    totalDurationMinutes: slotDurationMinutes * slots.length,
    pricePerSlot,
    totalAmount: pricePerSlot * slots.length,
    currency: state?.currency ?? "Rs",
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
    } else if (
      !/^03[0-9]{9}$/.test(formData.phoneNumber.replace(/\s|-/g, ""))
    ) {
      newErrors.phoneNumber =
        "Please enter a valid Pakistani phone number (e.g. 03001234567)";
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
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse date string (e.g. "Wed May 10 2026") → "YYYY-MM-DD"
      const dateObj = new Date(state?.date ?? "");
      const bookingDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

      // All selected slots ride along as a single compact param
      const encodedSlots = encodeSlots(slots);

      // Bundle all booking + client details to pass through PayFast redirect URLs
      const bookingParams = new URLSearchParams({
        turfId: String(state?.turfId ?? ""),
        turfName: state?.turfName ?? "",
        location: state?.location ?? "",
        date: bookingDate,
        displayDate: state?.date ?? "",
        slots: encodedSlots,
        slotDuration: String(slotDurationMinutes),
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        pricePerSlot: String(pricePerSlot),
        currency: state?.currency ?? "PKR",
      }).toString();

      const failureParams = new URLSearchParams({
        turfId: String(state?.turfId ?? ""),
        turfName: state?.turfName ?? "",
        location: state?.location ?? "",
        date: state?.date ?? "",
        slots: encodedSlots,
        slotDuration: String(slotDurationMinutes),
        customerName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        amountToPay: String(bookingData.totalAmount),
        pricePerSlot: String(pricePerSlot),
        currency: state?.currency ?? "PKR",
      }).toString();

      // PayFast redirects the browser back to us, so these must be absolute
      // and match wherever the app is actually being served from.
      const origin = window.location.origin;

      // Initiate PayFast transaction (no DB writes yet)
      const paymentRes = await fetch(`${APP_BASE_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transAmount: String(bookingData.totalAmount),
          currencyCode: state?.currency ?? "PKR",
          customerEmail: formData.email.trim() || "noreply@turfkhana.com",
          customerMobile: formData.phoneNumber.trim(),
          successUrl: `${origin}/booking-confirmation/${state?.turfId}?${bookingParams}`,
          failureUrl: `${origin}/booking-failure?${failureParams}`,
          checkoutUrl: `${origin}/booking-form/${state?.turfId}`,
          items: [
            {
              SKU: `TURF-${state?.turfId}`,
              NAME: state?.turfName,
              PRICE: String(pricePerSlot),
              QTY: String(slots.length),
            },
          ],
        }),
      });

      if (!paymentRes.ok) {
        const err = await paymentRes.json();
        throw new Error(err?.error?.message ?? "Failed to initiate payment");
      }

      const { payload } = await paymentRes.json();

      // Submit payload to PayFast transaction page
      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "ITEMS" && Array.isArray(value)) {
          (value as any[]).forEach((item, index) => {
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = `ITEMS[${index}][${itemKey}]`;
              input.value = String(itemValue);
              form.appendChild(input);
            });
          });
        } else {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      toaster.error({
        title: "Booking Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isStateValid) {
    return null;
  }

  return (
    <Box minH="100vh" bg={pageBg} py={{ base: 6, md: 12 }}>
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

                    {/* Email (locked to account when logged in) */}
                    <Field.Root invalid={!!errors.email}>
                      <Field.Label>
                        <HStack>
                          <Icon as={Mail} boxSize={4} />
                          <Text>Email Address</Text>
                          {!storedClient?.email && (
                            <Text fontSize="sm" color="gray.500">
                              (Optional)
                            </Text>
                          )}
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
                        disabled={!!storedClient?.email}
                        borderColor={borderColor}
                        _focus={{
                          borderColor: "green.500",
                          boxShadow: "0 0 0 1px #38A169",
                        }}
                        _disabled={{
                          opacity: 0.7,
                          cursor: "not-allowed",
                        }}
                      />
                      {storedClient?.email && (
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          This is your account email and can't be changed here.
                        </Text>
                      )}
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
                    {/* <Link to={`/booking-confirmation/${bookingData.id}`}> */}
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
                      Proceed to Checkout
                    </Button>
                    {/* </Link> */}

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

                    <HStack justify="space-between" align="start">
                      <HStack color="gray.600">
                        <Icon as={Clock} boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium">
                          {bookingData.slots.length === 1
                            ? "Time"
                            : `Time Slots (${bookingData.slots.length})`}
                        </Text>
                      </HStack>
                      <VStack align="end" gap={1}>
                        {bookingData.slots.map((slot) => (
                          <Text
                            key={slot.startTime}
                            fontSize="sm"
                            fontWeight="semibold"
                          >
                            {slot.time}
                          </Text>
                        ))}
                      </VStack>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Total Duration
                      </Text>
                      <Text fontSize="sm" fontWeight="semibold">
                        {bookingData.totalDurationMinutes} minutes
                      </Text>
                    </HStack>
                  </VStack>

                  <Separator />

                  {/* Price Breakdown */}
                  <VStack gap={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Price per slot
                      </Text>
                      <Text fontSize="sm">
                        {bookingData.currency}{" "}
                        {bookingData.pricePerSlot.toLocaleString()}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Number of slots
                      </Text>
                      <Text fontSize="sm">× {bookingData.slots.length}</Text>
                    </HStack>

                    <Separator />

                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">
                        Total Amount
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.500">
                        {bookingData.currency}{" "}
                        {bookingData.totalAmount.toLocaleString()}
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
