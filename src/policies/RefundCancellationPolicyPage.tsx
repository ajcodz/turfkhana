import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Separator,
    Alert,
    AlertTitle,
    AlertDescription,
    Table,
    Badge,
    Stack,
    List,
    Link,
} from '@chakra-ui/react';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, DollarSign, Phone, Mail } from 'lucide-react';
import { useColorModeValue } from '../components/ui/color-mode';

const RefundCancellationPolicyPage: React.FC = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box minH="100vh" bg={bgColor} py={{ base: 8, md: 16 }}>
            <Container maxW="container.lg">
                <VStack gap={8} align="stretch">
                    {/* Header */}
                    <Box textAlign="center" mb={6}>
                        <Heading as="h1" size="2xl" mb={4} color="green.500">
                            Refund & Cancellation Policy
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Last Updated: December 13, 2025
                        </Text>
                    </Box>

                    {/* Important Notice */}
                    <Alert.Root
                        status="warning"
                        borderRadius="lg"
                    >
                        <Alert.Indicator />
                        <Box>
                            <AlertTitle fontSize="lg" mb={2}>
                                Important Notice
                            </AlertTitle>
                            <AlertDescription>
                                Please read this policy carefully before making a booking. By completing a
                                reservation on TurfKhana, you acknowledge and agree to the terms outlined in
                                this Refund & Cancellation Policy.
                            </AlertDescription>
                        </Box>
                    </Alert.Root>

                    {/* Main Content */}
                    <Box
                        bg={cardBg}
                        p={{ base: 6, md: 10 }}
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                        shadow="sm"
                    >
                        <VStack gap={8} align="stretch">
                            {/* Introduction */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    1. Overview
                                </Heading>
                                <Text color="gray.700" lineHeight="tall">
                                    At TurfKhana, we understand that plans can change. This Refund & Cancellation
                                    Policy outlines the terms and conditions under which bookings can be cancelled,
                                    rescheduled, or refunded. We strive to maintain fairness for both our customers
                                    and turf facility owners while ensuring optimal facility utilization.
                                </Text>
                            </Box>

                            <Separator />

                            {/* Cancellation Time Frames */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    2. Cancellation Time Frames & Refund Eligibility
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    The refund amount you are eligible for depends on when you cancel your booking
                                    relative to the scheduled booking time. Our tiered cancellation policy is as
                                    follows:
                                </Text>

                                <Box overflowX="auto">
                                    <Table.Root size="md">
                                        <Table.Header bg={useColorModeValue('green.50', 'green.900')}>
                                            <Table.Row>
                                                <Table.ColumnHeader>Cancellation Window</Table.ColumnHeader>
                                                <Table.ColumnHeader>Refund Amount</Table.ColumnHeader>
                                                <Table.ColumnHeader>Processing Fee</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell fontWeight="medium">
                                                    <Badge colorScheme="green" px={2} py={1} mr={2}>
                                                        Full Refund
                                                    </Badge>
                                                    24+ hours before booking
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text fontWeight="bold" color="green.600">
                                                        100% refund
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>No fee</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell fontWeight="medium">
                                                    <Badge colorScheme="yellow" px={2} py={1} mr={2}>
                                                        Partial Refund
                                                    </Badge>
                                                    12-24 hours before booking
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text fontWeight="bold" color="yellow.600">
                                                        75% refund
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>25% deduction</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell fontWeight="medium">
                                                    <Badge colorScheme="orange" px={2} py={1} mr={2}>
                                                        Limited Refund
                                                    </Badge>
                                                    6-12 hours before booking
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text fontWeight="bold" color="orange.600">
                                                        50% refund
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>50% deduction</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell fontWeight="medium">
                                                    <Badge colorScheme="red" px={2} py={1} mr={2}>
                                                        No Refund
                                                    </Badge>
                                                    Less than 6 hours before booking
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text fontWeight="bold" color="red.600">
                                                        0% refund
                                                    </Text>
                                                </Table.Cell>
                                                <Table.Cell>100% forfeited</Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table.Root>
                                </Box>

                                <Alert.Root status="info" mt={6} borderRadius="lg">
                                    <Alert.Indicator />
                                    <Box>
                                        <AlertDescription>
                                            <strong>Note:</strong> Cancellation time frames may be configured by
                                            individual turf owners. The times shown above represent our standard
                                            policy. Please check your booking confirmation for facility-specific terms.
                                        </AlertDescription>
                                    </Box>
                                </Alert.Root>
                            </Box>

                            <Separator />

                            {/* Rescheduling Policy */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    3. Rescheduling Policy
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    We understand that sometimes you need to change your booking time rather than
                                    cancel completely. TurfKhana offers flexible rescheduling options:
                                </Text>

                                <VStack gap={4} align="stretch">
                                    <Box
                                        p={4}
                                        bg={useColorModeValue('green.50', 'green.900')}
                                        borderRadius="lg"
                                        borderLeftWidth="4px"
                                        borderColor="green.500"
                                    >
                                        <Stack direction="row" mb={2}>
                                            <RefreshCw size={20} color="green" />
                                            <Heading as="h3" size="sm" color="green.700">
                                                Free Rescheduling (24+ Hours Notice)
                                            </Heading>
                                        </Stack>
                                        <List.Root gap={2}>
                                            <List.Item display="flex" alignItems="flex-start">
                                                <List.Indicator as={CheckCircle} color="green.500" />
                                                <Text color="gray.700" fontSize="sm">
                                                    Unlimited free rescheduling if done at least 24 hours before your
                                                    booking time
                                                </Text>
                                            </List.Item>
                                            <List.Item display="flex" alignItems="flex-start">
                                                <List.Indicator as={CheckCircle} color="green.500" />
                                                <Text color="gray.700" fontSize="sm">
                                                    Subject to availability of alternative time slots
                                                </Text>
                                            </List.Item>
                                            <List.Item display="flex" alignItems="flex-start">
                                                <List.Indicator as={CheckCircle} color="green.500" />
                                                <Text color="gray.700" fontSize="sm">
                                                    No additional charges or fees
                                                </Text>
                                            </List.Item>
                                        </List.Root>
                                    </Box>

                                    <Box
                                        p={4}
                                        bg={useColorModeValue('yellow.50', 'yellow.900')}
                                        borderRadius="lg"
                                        borderLeftWidth="4px"
                                        borderColor="yellow.500"
                                    >
                                        <Stack direction="row" mb={2}>
                                            <Clock size={20} color="orange" />
                                            <Heading as="h3" size="sm" color="yellow.700">
                                                Limited Rescheduling (12-24 Hours Notice)
                                            </Heading>
                                        </Stack>
                                        <List.Root gap={2}>
                                            <List.Item display="flex" alignItems="flex-start">
                                                <List.Indicator as={CheckCircle} color="yellow.500" />
                                                <Text color="gray.700" fontSize="sm">
                                                    One-time rescheduling allowed with Rs 500 processing fee
                                                </Text>
                                            </List.Item>
                                            <List.Item display="flex" alignItems="flex-start">
                                                <List.Indicator as={CheckCircle} color="yellow.500" />
                                                <Text color="gray.700" fontSize="sm">
                                                    Must be rescheduled to a time within the next 7 days
                                                </Text>
                                            </List.Item>
                                            <List.Item display="flex" alignItems="flex-start">
                                                <List.Indicator as={CheckCircle} color="yellow.500" />
                                                <Text color="gray.700" fontSize="sm">
                                                    Subject to slot availability
                                                </Text>
                                            </List.Item>
                                        </List.Root>
                                    </Box>

                                    <Box
                                        p={4}
                                        bg={useColorModeValue('red.50', 'red.900')}
                                        borderRadius="lg"
                                        borderLeftWidth="4px"
                                        borderColor="red.500"
                                    >
                                        <Stack direction="row" mb={2}>
                                            <XCircle size={20} color="red" />
                                            <Heading as="h3" size="sm" color="red.700">
                                                No Rescheduling (Less Than 12 Hours)
                                            </Heading>
                                        </Stack>
                                        <List.Root gap={2}>
                                            <List.Item display="flex" alignItems="flex-start">
                                                <List.Indicator as={XCircle} color="red.500" />
                                                <Text color="gray.700" fontSize="sm">
                                                    Rescheduling is not permitted within 12 hours of booking time
                                                </Text>
                                            </List.Item>
                                            <List.Item display="flex" alignItems="flex-start">
                                                <List.Indicator as={XCircle} color="red.500" />
                                                <Text color="gray.700" fontSize="sm">
                                                    You may cancel and forfeit payment per the cancellation policy
                                                </Text>
                                            </List.Item>
                                        </List.Root>
                                    </Box>
                                </VStack>
                            </Box>

                            <Separator />

                            {/* Guaranteed Refund Scenarios */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    4. Guaranteed Full Refund Scenarios
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    Regardless of the cancellation time frame, you are entitled to a full 100%
                                    refund in the following circumstances:
                                </Text>

                                <List.Root gap={3}>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={CheckCircle} color="green.500" mt={1} boxSize={6} />
                                        <Box>
                                            <Text color="gray.700" fontWeight="semibold" mb={1}>
                                                Slot Unavailability Due to Facility Issues
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                If the turf facility becomes unavailable due to maintenance, damage,
                                                flooding, or other facility-related issues beyond your control, you will
                                                receive a full refund within 3-5 business days.
                                            </Text>
                                        </Box>
                                    </List.Item>

                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={CheckCircle} color="green.500" mt={1} boxSize={6} />
                                        <Box>
                                            <Text color="gray.700" fontWeight="semibold" mb={1}>
                                                System or Technical Failures
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                If your booking was affected by a technical glitch, system error, payment
                                                processing failure, or any malfunction on the TurfKhana platform that
                                                prevented proper booking confirmation, you are entitled to a full refund.
                                            </Text>
                                        </Box>
                                    </List.Item>

                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={CheckCircle} color="green.500" mt={1} boxSize={6} />
                                        <Box>
                                            <Text color="gray.700" fontWeight="semibold" mb={1}>
                                                Double Booking or Administrative Errors
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                If the facility was double-booked due to an error on our part or the turf
                                                owner's part, and an alternative time slot cannot be arranged, you will
                                                receive a full refund plus a Rs 1,000 credit toward your next booking.
                                            </Text>
                                        </Box>
                                    </List.Item>

                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={CheckCircle} color="green.500" mt={1} boxSize={6} />
                                        <Box>
                                            <Text color="gray.700" fontWeight="semibold" mb={1}>
                                                Severe Weather Conditions or Force Majeure
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                In case of extreme weather conditions (heavy rain, storms, etc.) or
                                                force majeure events (natural disasters, government restrictions, etc.)
                                                that make it unsafe or impossible to use the facility, full refunds will
                                                be issued automatically.
                                            </Text>
                                        </Box>
                                    </List.Item>

                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={CheckCircle} color="green.500" mt={1} boxSize={6} />
                                        <Box>
                                            <Text color="gray.700" fontWeight="semibold" mb={1}>
                                                Facility Closure Without Notice
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                If the turf facility is closed on your booking date without at least 12
                                                hours advance notice, you are entitled to a full refund plus a 20%
                                                discount voucher for future bookings.
                                            </Text>
                                        </Box>
                                    </List.Item>
                                </List.Root>
                            </Box>

                            <Separator />

                            {/* Refund Processing */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    5. Refund Processing Timeline
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    Once your cancellation or refund request has been approved, the refund will be
                                    processed according to the following timeline:
                                </Text>

                                <List.Root gap={3}>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={DollarSign} color="green.500" mt={1} />
                                        <Box>
                                            <Text color="gray.700" fontWeight="medium">
                                                Bank Transfers / Online Payment Methods:
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                5-7 business days from approval date
                                            </Text>
                                        </Box>
                                    </List.Item>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={DollarSign} color="green.500" mt={1} />
                                        <Box>
                                            <Text color="gray.700" fontWeight="medium">
                                                Credit/Debit Cards:
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                7-10 business days depending on your bank's processing time
                                            </Text>
                                        </Box>
                                    </List.Item>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={DollarSign} color="green.500" mt={1} />
                                        <Box>
                                            <Text color="gray.700" fontWeight="medium">
                                                TurfKhana Wallet Credit:
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                Instant credit within 24 hours (can be used for future bookings)
                                            </Text>
                                        </Box>
                                    </List.Item>
                                </List.Root>

                                <Alert.Root status="info" mt={4} borderRadius="lg">
                                    <Alert.Indicator />
                                    <AlertDescription fontSize="sm">
                                        Refunds will be processed through the same payment method used for the
                                        original booking. If this is not possible, we will contact you to arrange
                                        an alternative refund method.
                                    </AlertDescription>
                                </Alert.Root>
                            </Box>

                            <Separator />

                            {/* No-Show Policy */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    6. No-Show Policy
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    If you fail to show up for your confirmed booking without prior cancellation:
                                </Text>

                                <List.Root gap={3}>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={XCircle} color="red.500" mt={1} />
                                        <Text color="gray.700">
                                            <strong>No refund will be issued</strong> for no-show bookings
                                        </Text>
                                    </List.Item>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={XCircle} color="red.500" mt={1} />
                                        <Text color="gray.700">
                                            The full booking amount will be forfeited
                                        </Text>
                                    </List.Item>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={XCircle} color="red.500" mt={1} />
                                        <Text color="gray.700">
                                            Multiple no-shows may result in restrictions on future bookings
                                        </Text>
                                    </List.Item>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={AlertTriangle} color="yellow.500" mt={1} />
                                        <Text color="gray.700">
                                            If you're running late, please contact the facility immediately via the
                                            app or phone to avoid being marked as a no-show
                                        </Text>
                                    </List.Item>
                                </List.Root>
                            </Box>

                            <Separator />

                            {/* How to Request */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    7. How to Request a Cancellation or Refund
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    To cancel your booking or request a refund, please follow these steps:
                                </Text>

                                <VStack gap={3} align="stretch">
                                    <Box
                                        p={4}
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="lg"
                                    >
                                        <Text fontWeight="semibold" mb={2}>
                                            Step 1: Access Your Booking
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Log in to your TurfKhana account and navigate to "My Bookings"
                                        </Text>
                                    </Box>

                                    <Box
                                        p={4}
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="lg"
                                    >
                                        <Text fontWeight="semibold" mb={2}>
                                            Step 2: Select the Booking
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Find the booking you wish to cancel and click "Cancel Booking"
                                        </Text>
                                    </Box>

                                    <Box
                                        p={4}
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="lg"
                                    >
                                        <Text fontWeight="semibold" mb={2}>
                                            Step 3: Provide Reason
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Select a cancellation reason from the dropdown menu
                                        </Text>
                                    </Box>

                                    <Box
                                        p={4}
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="lg"
                                    >
                                        <Text fontWeight="semibold" mb={2}>
                                            Step 4: Confirm Cancellation
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Review the refund amount based on your cancellation time and confirm
                                        </Text>
                                    </Box>

                                    <Box
                                        p={4}
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="lg"
                                    >
                                        <Text fontWeight="semibold" mb={2}>
                                            Step 5: Receive Confirmation
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            You will receive an email and SMS confirmation with refund details
                                        </Text>
                                    </Box>
                                </VStack>

                                <Text color="gray.600" fontSize="sm" mt={4}>
                                    For assistance, contact our customer support at{' '}
                                    <Text as="span" color="green.600" fontWeight="medium">
                                        ajcodzhq@gmail.com
                                    </Text>{' '}
                                    or call{' '}
                                    <Text as="span" color="green.600" fontWeight="medium">
                                        +92 315 4807718
                                    </Text>
                                </Text>
                            </Box>

                            <Separator />

                            {/* Special Circumstances */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    8. Special Circumstances & Exceptions
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    We understand that unexpected situations may arise. In the following cases,
                                    special consideration may be given:
                                </Text>

                                <List.Root gap={3}>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={AlertTriangle} color="yellow.500" mt={1} />
                                        <Text color="gray.700">
                                            <strong>Medical Emergencies:</strong> If you have a documented medical
                                            emergency, please contact our support team with relevant documentation
                                            within 48 hours of your booking for case-by-case review
                                        </Text>
                                    </List.Item>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={AlertTriangle} color="yellow.500" mt={1} />
                                        <Text color="gray.700">
                                            <strong>Death in Family:</strong> Full refunds are available with
                                            appropriate documentation
                                        </Text>
                                    </List.Item>
                                    <List.Item display="flex" alignItems="flex-start">
                                        <List.Indicator as={AlertTriangle} color="yellow.500" mt={1} />
                                        <Text color="gray.700">
                                            <strong>Government-Imposed Restrictions:</strong> If government lockdowns
                                            or restrictions prevent you from using the facility, full refunds will be
                                            automatically processed
                                        </Text>
                                    </List.Item>
                                </List.Root>
                            </Box>

                            <Separator />

                            {/* Contact for Disputes */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    9. Disputes & Appeals
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    If you believe your cancellation or refund request was handled incorrectly, you
                                    may file an appeal:
                                </Text>

                                <Box
                                    p={6}
                                    bg={useColorModeValue('blue.50', 'blue.900')}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="blue.200"
                                >
                                    <VStack gap={3} align="stretch">
                                        <Text fontWeight="semibold" color="gray.800">
                                            Dispute Resolution Process:
                                        </Text>
                                        <Text fontSize="sm" color="gray.700">
                                            1. Email us at{' '}
                                            <Text as="span" color="blue.600" fontWeight="medium">
                                                ajcodzhq@gmail.com
                                            </Text>{' '}
                                            with your booking ID and dispute details
                                        </Text>
                                        <Text fontSize="sm" color="gray.700">
                                            2. Include any supporting documentation or evidence
                                        </Text>
                                        <Text fontSize="sm" color="gray.700">
                                            3. Our disputes team will review your case within 3-5 business days
                                        </Text>
                                        <Text fontSize="sm" color="gray.700">
                                            4. You will receive a written response with the final decision
                                        </Text>
                                    </VStack>
                                </Box>
                            </Box>

                            <Separator />

                            {/* Policy Updates */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    10. Policy Updates
                                </Heading>
                                <Text color="gray.700" lineHeight="tall">
                                    TurfKhana reserves the right to modify this Refund & Cancellation Policy at any
                                    time. Changes will be posted on this page with an updated "Last Updated" date.
                                    Bookings made after the policy change will be subject to the new terms. We
                                    encourage you to review this policy periodically.
                                </Text>
                            </Box>

                            <Separator />

                            {/* Contact Information */}
                            <Box>
                                <Heading as="h2" size="lg" mb={4}>
                                    11. Contact Us
                                </Heading>
                                <Text color="gray.700" lineHeight="tall" mb={4}>
                                    If you have any questions, concerns, or requests regarding this Refund & Cancellation Policy, please contact us:
                                </Text>

                                <VStack
                                    gap={4}
                                    align="stretch"
                                    p={6}
                                    bg={useColorModeValue('green.50', 'green.900')}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="green.200"
                                >
                                    <Box display="flex" alignItems="center">
                                        <Box
                                            as="span"
                                            display="inline-flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            w={10}
                                            h={10}
                                            bg="green.500"
                                            borderRadius="full"
                                            mr={4}
                                        >
                                            <Mail size={20} color="white" />
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold" color="gray.800">
                                                Email
                                            </Text>
                                            <Link href="mailto:ajcodzhq@gmail.com" color="green.600" fontWeight="medium">
                                                ajcodzhq@gmail.com
                                            </Link>
                                        </Box>
                                    </Box>

                                    <Box display="flex" alignItems="center">
                                        <Box
                                            as="span"
                                            display="inline-flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            w={10}
                                            h={10}
                                            bg="green.500"
                                            borderRadius="full"
                                            mr={4}
                                        >
                                            <Phone size={20} color="white" />
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold" color="gray.800">
                                                WhatsApp
                                            </Text>
                                            <Link href="tel:+923154807718" color="green.600" fontWeight="medium">
                                                +92 315 4807718
                                            </Link>
                                        </Box>
                                    </Box>

                                    {/* <Box display="flex" alignItems="flex-start">
                                        <Box
                                            as="span"
                                            display="inline-flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            w={10}
                                            h={10}
                                            bg="green.500"
                                            borderRadius="full"
                                            mr={4}
                                        >
                                            <MapPin size={20} color="white" />
                                        </Box>
                                        <Box>
                                            <Text fontWeight="semibold" color="gray.800">
                                                Address
                                            </Text>
                                            <Text color="gray.700">
                                                TurfKhana Headquarters
                                                <br />
                                                Model Town, Lahore
                                                <br />
                                                Punjab, Pakistan
                                            </Text>
                                        </Box>
                                    </Box> */}
                                </VStack>

                                <Text color="gray.600" fontSize="sm" mt={4} fontStyle="italic">
                                    We aim to respond to all refund & cancellation related inquiries within 48 hours.
                                </Text>
                            </Box>
                        </VStack>
                    </Box>
                    <Box textAlign="center" color="gray.500" fontSize="sm">
                        <Text>By using TurfKhana's services, you acknowledge that you have read and understood this Refund & Cancellation Policy.</Text>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default RefundCancellationPolicyPage;