import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Text,
    VStack,
    Avatar,
    Menu,
    Input,
    SimpleGrid,
    Separator,
    InputGroup,
    Portal,
    NativeSelect,
    Field,
    Checkbox
} from '@chakra-ui/react';
import {
    Settings,
    AlignJustify,
    Bell,
    LogOut,
    User,
    DollarSign,
    Clock,
    Calendar,
    Save,
} from 'lucide-react';
import { toaster } from '../components/ui/toaster';
import { useColorModeValue } from '../components/ui/color-mode';
import type { DashboardContext } from './DashboardPage';
import { useOutletContext } from 'react-router-dom';

interface SettingsData {
    hourlyPrice: string;
    openingTime: string;
    closingTime: string;
    closedDays: string[];
}

const AdminSettingsPage: React.FC = () => {
    const { onOpen } = useOutletContext<DashboardContext>();

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const closedDaysBg = useColorModeValue('orange.50', 'orange.900');
    const noteBg = useColorModeValue('blue.50', 'blue.900');

    const [settings, setSettings] = useState<SettingsData>({
        hourlyPrice: '2500',
        openingTime: '06:00',
        closingTime: '22:00',
        closedDays: [],
    });

    const [isSaving, setIsSaving] = useState(false);

    const daysOfWeek = [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' },
    ];

    const handleDayToggle = (day: string) => {
        setSettings((prev) => ({
            ...prev,
            closedDays: prev.closedDays.includes(day)
                ? prev.closedDays.filter((d) => d !== day)
                : [...prev.closedDays, day],
        }));
    };

    const handleSaveSettings = () => {
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            toaster.success({
                title: "Your turf settings have been updated successfully.",
                duration: 3000,
                closable: true,
            })
            // toast({
            //     title: 'Settings Saved',
            //     description: 'Your turf settings have been updated successfully.',
            //     status: 'success',
            //     duration: 3000,
            //     isClosable: true,
            // });
        }, 1000);
    };

    return (
            <Box flex={1} ml={{ base: 0, lg: '280px' }}>
                {/* Top Navbar */}
                <Box
                    bg={cardBg}
                    borderBottomWidth="1px"
                    borderColor={borderColor}
                    px={6}
                    py={4}
                    position="sticky"
                    top={0}
                    zIndex={10}
                >
                    <Flex justify="space-between" align="center">
                        <HStack gap={4}>
                            <IconButton
                                aria-label="Open menu"
                                variant="ghost"
                                display={{ base: 'flex', lg: 'none' }}
                                onClick={onOpen}
                            >
                                <AlignJustify />
                            </IconButton>
                            <Box>
                                <Heading as="h1" size="lg">
                                    Settings
                                </Heading>
                                <Text fontSize="sm" color="gray.500">
                                    Manage your turf configuration
                                </Text>
                            </Box>
                        </HStack>

                        <HStack gap={3}>
                            <IconButton
                                aria-label="Notifications"
                                variant="ghost"
                                position="relative"
                            >
                                <Bell />
                                <Box
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    w={2}
                                    h={2}
                                    bg="red.500"
                                    borderRadius="full"
                                />
                            </IconButton>


                            <Menu.Root>
                                <Menu.Trigger
                                    asChild
                                >
                                    <Box display={{ base: 'none', md: 'block' }} textAlign="right" mr={2}>
                                        <Text fontSize="sm" fontWeight="semibold">
                                            Admin User
                                        </Text>
                                    </Box>
                                    <Button
                                        variant="ghost">
                                        <Avatar.Root size="sm" bg="green.500">
                                            <Avatar.Fallback name="Admin" />
                                        </Avatar.Root>
                                    </Button>

                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.Item value='profile'><User size={16} />Profile</Menu.Item>
                                            <Menu.Item value='settings'>
                                                <Settings size={16} />Settings</Menu.Item>
                                            <Menu.Item value='logout' color="red.500">
                                                <LogOut size={16} />Logout
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        </HStack>
                    </Flex>
                </Box>

                {/* Settings Content */}
                <Container maxW="container.lg" py={8}>
                    <VStack gap={6} align="stretch">
                        {/* Pricing Settings */}
                        <Box
                            bg={cardBg}
                            p={6}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <VStack gap={6} align="stretch">
                                <HStack gap={3}>
                                    <Icon as={DollarSign} color="green.500" boxSize={6} />
                                    <Box>
                                        <Heading as="h2" size="md">
                                            Pricing
                                        </Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            Set your hourly rate for turf bookings
                                        </Text>
                                    </Box>
                                </HStack>

                                <Separator />

                                <Field.Root>
                                    <Field.Label fontWeight="semibold">Hourly Price</Field.Label>
                                    <InputGroup startAddon={"Rs"} maxW="300px">

                                        <Input
                                            type="number"
                                            value={settings.hourlyPrice}
                                            onChange={(e) =>
                                                setSettings((prev) => ({ ...prev, hourlyPrice: e.target.value }))
                                            }
                                            placeholder="2500"
                                            size="lg"
                                        />
                                    </InputGroup>
                                    <Text fontSize="xs" color="gray.500" mt={2}>
                                        This rate will apply to all new bookings
                                    </Text>
                                </Field.Root>
                            </VStack>
                        </Box>

                        {/* Operating Hours */}
                        <Box
                            bg={cardBg}
                            p={6}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <VStack gap={6} align="stretch">
                                <HStack gap={3}>
                                    <Icon as={Clock} color="green.500" boxSize={6} />
                                    <Box>
                                        <Heading as="h2" size="md">
                                            Operating Hours
                                        </Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            Define when your turf is available for bookings
                                        </Text>
                                    </Box>
                                </HStack>

                                <Separator />

                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                    <Field.Root>
                                        <Field.Label fontWeight="semibold">Opening Time</Field.Label>
                                        <NativeSelect.Root
                                            size="lg"
                                        >
                                            <NativeSelect.Field value={settings.openingTime}
                                                onChange={(e) =>
                                                    setSettings((prev) => ({ ...prev, openingTime: e.target.value }))
                                                }>
                                                <option value="05:00">05:00 AM</option>
                                                <option value="06:00">06:00 AM</option>
                                                <option value="07:00">07:00 AM</option>
                                                <option value="08:00">08:00 AM</option>
                                                <option value="09:00">09:00 AM</option>
                                                <option value="10:00">10:00 AM</option>
                                            </NativeSelect.Field>
                                        </NativeSelect.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label fontWeight="semibold">Closing Time</Field.Label>
                                        <NativeSelect.Root
                                            size="lg"
                                        >
                                            <NativeSelect.Field value={settings.closingTime}
                                                onChange={(e) =>
                                                    setSettings((prev) => ({ ...prev, closingTime: e.target.value }))
                                                }>
                                                <option value="18:00">06:00 PM</option>
                                                <option value="19:00">07:00 PM</option>
                                                <option value="20:00">08:00 PM</option>
                                                <option value="21:00">09:00 PM</option>
                                                <option value="22:00">10:00 PM</option>
                                                <option value="23:00">11:00 PM</option>
                                                <option value="00:00">12:00 AM</option>
                                            </NativeSelect.Field>
                                        </NativeSelect.Root>
                                    </Field.Root>
                                </SimpleGrid>

                                <Box
                                    p={4}
                                    bg={noteBg}
                                    borderRadius="lg"
                                >
                                    <Text fontSize="sm" color="gray.700">
                                        Note: Bookings will only be available between these hours.
                                        Make sure to account for setup and cleanup time.
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>

                        {/* Closed Days */}
                        <Box
                            bg={cardBg}
                            p={6}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <VStack gap={6} align="stretch">
                                <HStack gap={3}>
                                    <Icon as={Calendar} color="green.500" boxSize={6} />
                                    <Box>
                                        <Heading as="h2" size="md">
                                            Closed Days
                                        </Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            Select days when your turf is not available
                                        </Text>
                                    </Box>
                                </HStack>

                                <Separator />

                                <Box>
                                    <Text fontWeight="semibold" mb={4}>
                                        Select Days to Close
                                    </Text>
                                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
                                        {daysOfWeek.map((day) => (
                                            <Checkbox.Root
                                                key={day.value}
                                                checked={settings.closedDays.includes(day.value)}
                                                onChange={() => handleDayToggle(day.value)}
                                                size="lg"
                                                colorPalette="green"
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                                <Checkbox.Label fontSize="md">{day.label}</Checkbox.Label>
                                            </Checkbox.Root>
                                        ))}
                                    </SimpleGrid>
                                </Box>

                                {settings.closedDays.length > 0 && (
                                    <Box
                                        p={4}
                                        bg={closedDaysBg}
                                        borderRadius="lg"
                                    >
                                        <Text fontSize="sm" fontWeight="semibold" color="orange.700" mb={1}>
                                            Selected Closed Days:
                                        </Text>
                                        <Text fontSize="sm" color="gray.700">
                                            {settings.closedDays
                                                .map((d) => daysOfWeek.find((day) => day.value === d)?.label)
                                                .join(', ')}
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        </Box>

                        {/* Save Button */}
                        <Flex justify="flex-end">
                            <IconButton
                                colorScheme="green"
                                size="lg"
                                px={12}
                                onClick={handleSaveSettings}
                                loading={isSaving}
                                loadingText="Saving..."
                                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                                transition="all 0.2s"
                            >
                                <Icon as={Save} />
                                Save Changes
                            </IconButton>
                        </Flex>

                        {/* Additional Info */}
                        <Box
                            p={4}
                            bg={useColorModeValue('gray.100', 'gray.700')}
                            borderRadius="lg"
                            borderLeftWidth="4px"
                            borderColor="green.500"
                        >
                            <Text fontSize="sm" color="gray.600">
                                Important: Changes to pricing and operating hours will take
                                effect immediately. Existing bookings will not be affected. Make sure to
                                communicate any changes to your customers in advance.
                            </Text>
                        </Box>
                    </VStack>
                </Container>
            </Box>
    );
};

export default AdminSettingsPage;