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
    Input,
    InputGroup,
    Text,
    VStack,
    Avatar,
    Badge,
    Table,
    Menu,
    Portal,
    useDisclosure,
    NativeSelect,
} from '@chakra-ui/react';
import {
    BookOpen,
    Settings,
    AlignJustify,
    Bell,
    LogOut,
    User,
    ChevronRight,
    Search,
    ChevronLeft,
    Filter,
    Eye,
} from 'lucide-react';
import { useColorModeValue } from '../components/ui/color-mode';

interface Booking {
    id: string;
    customerName: string;
    customerPhone: string;
    turfName: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    amount: number;
}

const AdminBookingListPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const { onOpen } = useDisclosure();

    const itemsPerPage = 10;

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    // Mock bookings data
    const allBookings: Booking[] = [
        {
            id: 'TK-2025-1542',
            customerName: 'Ahmad Hassan',
            customerPhone: '+92 300 1234567',
            turfName: 'Premier Cricket Ground',
            date: 'Dec 4, 2025',
            time: '06:00 PM',
            status: 'confirmed',
            amount: 2500,
        },
        {
            id: 'TK-2025-1543',
            customerName: 'Ali Raza',
            customerPhone: '+92 301 9876543',
            turfName: 'Elite Futsal Arena',
            date: 'Dec 4, 2025',
            time: '07:00 PM',
            status: 'pending',
            amount: 3000,
        },
        {
            id: 'TK-2025-1544',
            customerName: 'Usman Malik',
            customerPhone: '+92 302 5551234',
            turfName: 'Valley Cricket Pitch',
            date: 'Dec 3, 2025',
            time: '05:00 PM',
            status: 'completed',
            amount: 2000,
        },
        {
            id: 'TK-2025-1545',
            customerName: 'Hassan Khan',
            customerPhone: '+92 303 7778888',
            turfName: 'Champions Futsal Court',
            date: 'Dec 5, 2025',
            time: '08:00 PM',
            status: 'confirmed',
            amount: 2800,
        },
        {
            id: 'TK-2025-1546',
            customerName: 'Bilal Ahmed',
            customerPhone: '+92 304 1112222',
            turfName: 'Premier Cricket Ground',
            date: 'Dec 2, 2025',
            time: '04:00 PM',
            status: 'cancelled',
            amount: 2500,
        },
        {
            id: 'TK-2025-1547',
            customerName: 'Fahad Ali',
            customerPhone: '+92 305 3334444',
            turfName: 'Elite Futsal Arena',
            date: 'Dec 6, 2025',
            time: '06:00 PM',
            status: 'confirmed',
            amount: 3000,
        },
        {
            id: 'TK-2025-1548',
            customerName: 'Imran Siddiqui',
            customerPhone: '+92 306 5556666',
            turfName: 'Valley Cricket Pitch',
            date: 'Dec 7, 2025',
            time: '07:00 PM',
            status: 'pending',
            amount: 2000,
        },
        {
            id: 'TK-2025-1549',
            customerName: 'Kamran Akmal',
            customerPhone: '+92 307 7778888',
            turfName: 'Champions Futsal Court',
            date: 'Dec 8, 2025',
            time: '05:00 PM',
            status: 'confirmed',
            amount: 2800,
        },
        {
            id: 'TK-2025-1550',
            customerName: 'Nasir Jamshed',
            customerPhone: '+92 308 9990000',
            turfName: 'Premier Cricket Ground',
            date: 'Dec 9, 2025',
            time: '08:00 PM',
            status: 'completed',
            amount: 2500,
        },
        {
            id: 'TK-2025-1551',
            customerName: 'Saeed Ajmal',
            customerPhone: '+92 309 1112222',
            turfName: 'Elite Futsal Arena',
            date: 'Dec 10, 2025',
            time: '06:00 PM',
            status: 'confirmed',
            amount: 3000,
        },
        {
            id: 'TK-2025-1552',
            customerName: 'Wahab Riaz',
            customerPhone: '+92 310 3334444',
            turfName: 'Valley Cricket Pitch',
            date: 'Dec 11, 2025',
            time: '07:00 PM',
            status: 'pending',
            amount: 2000,
        },
        {
            id: 'TK-2025-1553',
            customerName: 'Yasir Shah',
            customerPhone: '+92 311 5556666',
            turfName: 'Champions Futsal Court',
            date: 'Dec 12, 2025',
            time: '05:00 PM',
            status: 'confirmed',
            amount: 2800,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'completed':
                return 'blue';
            case 'cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    // Filter bookings based on search and status
    const filteredBookings = allBookings.filter((booking) => {
        const matchesSearch =
            booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.turfName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBookings = filteredBookings.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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
                                    Bookings
                                </Heading>
                                <Text fontSize="sm" color="gray.500">
                                    Manage all turf bookings
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

                {/* Bookings Content */}
                <Container maxW="container.xl" py={8}>
                    <VStack gap={6} align="stretch">
                        {/* Filters and Search Bar */}
                        <Box
                            bg={cardBg}
                            p={6}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <Flex
                                direction={{ base: 'column', md: 'row' }}
                                gap={4}
                                align={{ base: 'stretch', md: 'center' }}
                                justify="space-between"
                            >
                                {/* Search Bar */}
                                <InputGroup startElement={
                                    <Icon pointerEvents="none" as={Search} color="gray.400" />} maxW={{ base: '100%', md: '400px' }} flex={1}>
                                    <Input
                                        placeholder="Search by booking ID, customer name, or turf..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        size="lg"
                                    />
                                </InputGroup>

                                {/* Status Filter */}
                                <HStack gap={3}>
                                    <Icon as={Filter} color="gray.500" display={{ base: 'none', md: 'block' }} />
                                    <NativeSelect.Root
                                        size="lg"
                                        maxW="200px">
                                        <NativeSelect.Field
                                            value={statusFilter}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </NativeSelect.Field>
                                    </NativeSelect.Root>
                                </HStack>
                            </Flex>

                            {/* Results Count */}
                            <Text fontSize="sm" color="gray.600" mt={4}>
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} of{' '}
                                {filteredBookings.length} bookings
                            </Text>
                        </Box>

                        {/* Bookings Table */}
                        <Box
                            bg={cardBg}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            shadow="sm"
                            overflow="hidden"
                        >
                            <Box overflowX="auto">
                                <Table.Root>
                                    <Table.Header bg={useColorModeValue('gray.50', 'gray.700')}>
                                        <Table.Row>
                                            <Table.ColumnHeader>Booking ID</Table.ColumnHeader>
                                            <Table.ColumnHeader>Customer</Table.ColumnHeader>
                                            <Table.ColumnHeader>Turf</Table.ColumnHeader>
                                            <Table.ColumnHeader>Date</Table.ColumnHeader>
                                            <Table.ColumnHeader>Time</Table.ColumnHeader>
                                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                                            <Table.ColumnHeader>Amount</Table.ColumnHeader>
                                            <Table.ColumnHeader>Actions</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {currentBookings.length > 0 ? (
                                            currentBookings.map((booking) => (
                                                <Table.Row
                                                    key={booking.id}
                                                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                                                >
                                                    <Table.Cell fontWeight="medium" fontSize="sm">
                                                        {booking.id}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <HStack>
                                                            <Avatar.Root
                                                                size="sm"
                                                                bg="green.500"
                                                            >
                                                                <Avatar.Fallback name={booking.customerName} />
                                                            </Avatar.Root>
                                                            <Box>
                                                                <Text fontSize="sm" fontWeight="medium">
                                                                    {booking.customerName}
                                                                </Text>
                                                                <Text fontSize="xs" color="gray.500">
                                                                    {booking.customerPhone}
                                                                </Text>
                                                            </Box>
                                                        </HStack>
                                                    </Table.Cell>
                                                    <Table.Cell fontSize="sm">{booking.turfName}</Table.Cell>
                                                    <Table.Cell fontSize="sm">{booking.date}</Table.Cell>
                                                    <Table.Cell fontSize="sm">{booking.time}</Table.Cell>
                                                    <Table.Cell>
                                                        <Badge
                                                            colorScheme={getStatusColor(booking.status)}
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            textTransform="capitalize"
                                                        >
                                                            {booking.status}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell fontWeight="semibold" fontSize="sm">
                                                        Rs {booking.amount.toLocaleString()}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <IconButton
                                                            aria-label="View details"
                                                            size="sm"
                                                            variant="ghost"
                                                            colorScheme="green"
                                                        >
                                                            <Eye size={16} />
                                                        </IconButton>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        ) : (
                                            <Table.Row>
                                                <Table.Cell colSpan={8} textAlign="center" py={8}>
                                                    <VStack gap={2}>
                                                        <Icon as={BookOpen} boxSize={12} color="gray.300" />
                                                        <Text color="gray.500">No bookings found</Text>
                                                        <Text fontSize="sm" color="gray.400">
                                                            Try adjusting your search or filters
                                                        </Text>
                                                    </VStack>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </Box>

                        {/* Pagination */}
                        {filteredBookings.length > itemsPerPage && (
                            <Flex justify="space-between" align="center">
                                <Text fontSize="sm" color="gray.600">
                                    Page {currentPage} of {totalPages}
                                </Text>
                                <HStack gap={2}>
                                    <IconButton
                                        aria-label="Previous page"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(
                                            (page) =>
                                                page === 1 ||
                                                page === totalPages ||
                                                Math.abs(page - currentPage) <= 1
                                        )
                                        .map((page, index, array) => {
                                            const elements = [];
                                            if (index > 0 && array[index - 1] !== page - 1) {
                                                elements.push(
                                                    <Text key={`ellipsis-${page}`} color="gray.500">...</Text>
                                                );
                                            }
                                            elements.push(
                                                <Button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    variant={currentPage === page ? 'solid' : 'outline'}
                                                    colorScheme={currentPage === page ? 'green' : 'gray'}
                                                    size="sm"
                                                    minW="40px"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                            return elements;
                                        })}
                                    <IconButton
                                        aria-label="Next page"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ChevronRight />
                                    </IconButton>
                                </HStack>
                            </Flex>
                        )}
                    </VStack>
                </Container>
            </Box>
    );
};

export default AdminBookingListPage;