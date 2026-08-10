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
  Separator,
} from "@chakra-ui/react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useColorModeValue } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import { APP_BASE_URL } from "../utils/api";


interface ProfileFormData {
  name: string;
  phone: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminProfilePage: React.FC = () => {
  const storedOwner = JSON.parse(localStorage.getItem("owner") ?? "{}");

  const [profile, setProfile] = useState<ProfileFormData>({
    name: storedOwner?.name ?? "",
    phone: storedOwner?.phone ?? "",
    email: storedOwner?.email ?? "",
  });
  const [profileErrors, setProfileErrors] = useState<Partial<ProfileFormData>>(
    {},
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<PasswordFormData>
  >({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleProfileChange = (field: keyof ProfileFormData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordChange = (
    field: keyof PasswordFormData,
    value: string,
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateProfile = (): boolean => {
    const errors: Partial<ProfileFormData> = {};

    if (!profile.name.trim()) errors.name = "Name is required";
    if (!profile.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^03[0-9]{9}$/.test(profile.phone.replace(/\s|-/g, ""))) {
      errors.phone = "Please enter a valid Pakistani phone number";
    }
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = "Please enter a valid email address";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = (): boolean => {
    const errors: Partial<PasswordFormData> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setIsSavingProfile(true);
    try {
      const res = await fetch(`${APP_BASE_URL}/owners/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: profile.name.trim(),
          phone: profile.phone.trim(),
          email: profile.email.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toaster.error({
          title: "Update Failed",
          description: data?.error?.message ?? "Failed to update profile",
          duration: 4000,
          closable: true,
        });
        return;
      }

      localStorage.setItem("owner", JSON.stringify(data.owner));

      toaster.success({
        title: "Profile Updated",
        description: "Your details have been saved.",
        duration: 3000,
        closable: true,
      });
    } catch {
      toaster.error({
        title: "Update Failed",
        description: "Something went wrong. Please try again.",
        duration: 4000,
        closable: true,
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsSavingPassword(true);
    try {
      const res = await fetch(`${APP_BASE_URL}/owners/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: profile.name.trim(),
          phone: profile.phone.trim(),
          email: profile.email.trim() || null,
          currentPassword: passwordForm.currentPassword,
          password: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toaster.error({
          title: "Password Change Failed",
          description: data?.error ?? "Failed to change password",
          duration: 4000,
          closable: true,
        });
        return;
      }

      localStorage.setItem("owner", JSON.stringify(data.owner));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toaster.success({
        title: "Password Changed",
        description: "Your password has been updated.",
        duration: 3000,
        closable: true,
      });
    } catch {
      toaster.error({
        title: "Password Change Failed",
        description: "Something went wrong. Please try again.",
        duration: 4000,
        closable: true,
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack align="stretch" gap={8}>
        <Box>
          <Heading size="lg">My Profile</Heading>
          <Text color="fg.muted" mt={1}>
            Update your account details and password.
          </Text>
        </Box>

        {/* Profile Details */}
        <Box
          bg={cardBg}
          p={{ base: 6, md: 8 }}
          borderRadius="xl"
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack align="stretch" gap={5}>
            <Heading size="md">Account Details</Heading>

            <Field.Root invalid={!!profileErrors.name}>
              <Field.Label>
                <User size={16} style={{ marginRight: 6 }} />
                Full Name
              </Field.Label>
              <Input
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
              />
              <Field.ErrorText>{profileErrors.name}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!profileErrors.phone}>
              <Field.Label>
                <Phone size={16} style={{ marginRight: 6 }} />
                Phone Number
              </Field.Label>
              <Input
                value={profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                placeholder="03001234567"
              />
              <Field.ErrorText>{profileErrors.phone}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!profileErrors.email}>
              <Field.Label>
                <Mail size={16} style={{ marginRight: 6 }} />
                Email Address
              </Field.Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
              />
              <Field.ErrorText>{profileErrors.email}</Field.ErrorText>
            </Field.Root>

            <Button
              colorPalette="green"
              alignSelf="flex-start"
              onClick={handleSaveProfile}
              loading={isSavingProfile}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </VStack>
        </Box>

        {/* Change Password */}
        <Box
          bg={cardBg}
          p={{ base: 6, md: 8 }}
          borderRadius="xl"
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack align="stretch" gap={5}>
            <Heading size="md">Change Password</Heading>
            <Separator />

            <Field.Root invalid={!!passwordErrors.currentPassword}>
              <Field.Label>
                <Lock size={16} style={{ marginRight: 6 }} />
                Current Password
              </Field.Label>
              <InputGroup
                endElement={
                  <IconButton
                    aria-label="Toggle current password visibility"
                    onClick={() => setShowCurrent(!showCurrent)}
                    variant="ghost"
                    size="sm"
                    _hover={{ bg: "transparent" }}
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                }
              >
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange("currentPassword", e.target.value)
                  }
                />
              </InputGroup>
              <Field.ErrorText>
                {passwordErrors.currentPassword}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!passwordErrors.newPassword}>
              <Field.Label>
                <Lock size={16} style={{ marginRight: 6 }} />
                New Password
              </Field.Label>
              <InputGroup
                endElement={
                  <IconButton
                    aria-label="Toggle new password visibility"
                    onClick={() => setShowNew(!showNew)}
                    variant="ghost"
                    size="sm"
                    _hover={{ bg: "transparent" }}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                }
              >
                <Input
                  type={showNew ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                />
              </InputGroup>
              <Field.ErrorText>{passwordErrors.newPassword}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!passwordErrors.confirmPassword}>
              <Field.Label>
                <Lock size={16} style={{ marginRight: 6 }} />
                Confirm New Password
              </Field.Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
              />
              <Field.ErrorText>
                {passwordErrors.confirmPassword}
              </Field.ErrorText>
            </Field.Root>

            <Button
              colorPalette="red"
              variant="outline"
              alignSelf="flex-start"
              onClick={handleChangePassword}
              loading={isSavingPassword}
              loadingText="Updating..."
            >
              Change Password
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default AdminProfilePage;
