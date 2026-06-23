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
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  // const iconColor = useColorModeValue('gray.500', 'gray.400');

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      // Mock validation - replace with actual authentication
      if (
        formData.email === "admin@turfkhana.com" &&
        formData.password === "admin123"
      ) {
        toaster.success({
          title: "Login Successful",
          description: "Welcome back, Admin!",
          duration: 3000,
          closable: true,
        });
        // toast({
        //   title: 'Login Successful',
        //   description: 'Welcome back, Admin!',
        //   status: 'success',
        //   duration: 3000,
        //   isClosable: true,
        // });
        // Redirect to admin dashboard
        console.log("Redirecting to admin dashboard...");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        toaster.error({
          title: "Login Failed",
          description: "Invalid email or password",
          duration: 3000,
          closable: true,
        });
        // toast({
        //   title: 'Login Failed',
        //   description: 'Invalid email or password',
        //   status: 'error',
        //   duration: 3000,
        //   isClosable: true,
        // });
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
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
          {/* Logo/Header Section */}
          <VStack gap={3}>
            <Box
              bg={useColorModeValue("green.500", "green.600")}
              p={4}
              borderRadius="xl"
              display="inline-flex"
            >
              <Shield size={40} color="white" />
            </Box>
            <Heading as="h1" size="xl" textAlign="center">
              Admin Portal
            </Heading>
            <Text color="gray.600" textAlign="center">
              Sign in to access the TurfKhana dashboard
            </Text>
          </VStack>

          {/* Login Card */}
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
              {/* Email Input */}
              <Field.Root required invalid={!!errors.email}>
                <Field.Label fontWeight="medium">Email Address</Field.Label>
                <InputGroup
                  startElement={<Mail pointerEvents="none" size={20} />}
                >
                  <Input
                    type="email"
                    placeholder="admin@turfkhana.com"
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

              {/* Password Input */}
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
                    placeholder="Enter your password"
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

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                colorScheme="green"
                size="lg"
                w="100%"
                mt={4}
                loading={isSubmitting}
                loadingText="Signing in..."
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
              >
                Sign In
              </Button>

              {/* Demo Credentials */}
              <Box
                mt={4}
                p={4}
                bg={useColorModeValue("blue.50", "blue.900")}
                borderRadius="lg"
                fontSize="sm"
              >
                <Text
                  fontWeight="semibold"
                  mb={2}
                  color={useColorModeValue("blue.700", "blue.200")}
                >
                  Demo Credentials:
                </Text>
                <VStack
                  align="stretch"
                  gap={1}
                  fontSize="xs"
                  color={useColorModeValue("blue.600", "blue.300")}
                >
                  <Text>Email: admin@turfkhana.com</Text>
                  <Text>Password: admin123</Text>
                </VStack>
              </Box>
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

export default LoginPage;
