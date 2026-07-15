import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Field,
  Input,
  VStack,
  Heading,
  Text,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import { useNavigate, useLocation, Link } from "react-router-dom";

interface SignupFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const APP_BASE_URL = "http://localhost:3000/api/v1";

const ClientSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^03[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Please enter a valid Pakistani phone number (e.g. 03001234567)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${APP_BASE_URL}/clients/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toaster.error({
          title: "Signup Failed",
          description:
            typeof data?.error === "string"
              ? data.error
              : "Something went wrong. Please try again.",
          duration: 4000,
          closable: true,
        });
        return;
      }

      // Auto login after signup
      // Clear owner session first
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("owner");

      // Set client session
      localStorage.setItem("isClientLoggedIn", "true");
      localStorage.setItem("client", JSON.stringify(data.client));

      toaster.success({
        title: "Account Created!",
        description: `Welcome to TurfKhana, ${data.client.name}!`,
        duration: 4000,
        closable: true,
      });

      const redirectTo = (
        location.state as { redirectTo?: string; bookingState?: unknown } | null
      )?.redirectTo;
      const bookingState = (
        location.state as { redirectTo?: string; bookingState?: unknown } | null
      )?.bookingState;

      if (redirectTo) {
        navigate(redirectTo, { replace: true, state: bookingState });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toaster.error({
        title: "Signup Failed",
        description: "Something went wrong. Please try again.",
        duration: 3000,
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={4}
    >
      <Container maxW="container.sm">
        <VStack gap={8}>
          {/* Header */}
          <VStack gap={3}>
            <Box
              bg={useColorModeValue("green.500", "green.600")}
              p={4}
              borderRadius="xl"
              display="inline-flex"
            >
              <User size={40} color="white" />
            </Box>
            <Heading as="h1" size="xl" textAlign="center">
              Create Account
            </Heading>
            <Text color="gray.600" textAlign="center">
              Sign up to start booking turfs on TurfKhana
            </Text>
          </VStack>

          {/* Signup Card */}
          <Box
            bg={cardBg}
            p={{ base: 6, md: 10 }}
            borderRadius="2xl"
            shadow="xl"
            w="100%"
            maxW="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack gap={6} align="stretch">
              {/* Full Name */}
              <Field.Root required invalid={!!errors.name}>
                <Field.Label fontWeight="medium">Full Name</Field.Label>
                <InputGroup
                  startElement={<User pointerEvents="none" size={20} />}
                >
                  <Input
                    type="text"
                    placeholder="e.g. Ahsan Javed"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onKeyPress={handleKeyPress}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px #38A169",
                    }}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.name}</Field.ErrorText>
              </Field.Root>

              {/* Phone Number */}
              <Field.Root required invalid={!!errors.phone}>
                <Field.Label fontWeight="medium">Phone Number</Field.Label>
                <InputGroup
                  startElement={<Phone pointerEvents="none" size={20} />}
                >
                  <Input
                    type="tel"
                    placeholder="03001234567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onKeyPress={handleKeyPress}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px #38A169",
                    }}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.phone}</Field.ErrorText>
              </Field.Root>

              {/* Email */}
              <Field.Root required invalid={!!errors.email}>
                <Field.Label fontWeight="medium">Email Address</Field.Label>
                <InputGroup
                  startElement={<Mail pointerEvents="none" size={20} />}
                >
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onKeyPress={handleKeyPress}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px #38A169",
                    }}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              </Field.Root>

              {/* Password */}
              <Field.Root required invalid={!!errors.password}>
                <Field.Label fontWeight="medium">Password</Field.Label>
                <InputGroup
                  startElement={<Lock pointerEvents="none" size={20} />}
                  endElement={
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      _hover={{ bg: "transparent" }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px #38A169",
                    }}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.password}</Field.ErrorText>
              </Field.Root>

              {/* Confirm Password */}
              <Field.Root required invalid={!!errors.confirmPassword}>
                <Field.Label fontWeight="medium">Confirm Password</Field.Label>
                <InputGroup
                  startElement={<Lock pointerEvents="none" size={20} />}
                  endElement={
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      variant="ghost"
                      size="sm"
                      _hover={{ bg: "transparent" }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </IconButton>
                  }
                >
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px #38A169",
                    }}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
              </Field.Root>

              {/* Signup Button */}
              <Button
                onClick={handleSignup}
                colorScheme="green"
                size="lg"
                w="100%"
                mt={4}
                loading={isSubmitting}
                loadingText="Creating account..."
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
              >
                Create Account
              </Button>

              {/* Login Link */}
              <Link
                to="/login"
                state={location.state}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  w="100%"
                  color="gray.500"
                  _hover={{ color: "green.500" }}
                >
                  Already have an account? Login
                </Button>
              </Link>

              {/* Back to Home */}
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  w="100%"
                  color="gray.500"
                  _hover={{ color: "green.500" }}
                >
                  ← Back to Home
                </Button>
              </Link>
            </VStack>
          </Box>

          {/* Footer */}
          <Text fontSize="sm" color="gray.500" textAlign="center">
            © 2025 TurfKhana. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default ClientSignupPage;
