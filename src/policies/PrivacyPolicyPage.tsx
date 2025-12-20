import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link,
  List,
  Separator
} from '@chakra-ui/react';
import { CheckCircle, Mail, Phone } from 'lucide-react';
import { useColorModeValue } from '../components/ui/color-mode';

const PrivacyPolicyPage: React.FC = () => {
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
              Privacy Policy
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Last Updated: December 13, 2025
            </Text>
          </Box>

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
                  1. Introduction
                </Heading>
                <Text color="gray.700" lineHeight="tall">
                  TurfKhana ("we," "our," or "us") is committed to protecting your privacy and
                  ensuring the security of your personal information. This Privacy Policy explains
                  how we collect, use, disclose, and safeguard your information when you use our
                  indoor turf booking platform and services (the "Services"). By accessing or using
                  our Services, you agree to the collection and use of information in accordance
                  with this Privacy Policy.
                </Text>
              </Box>

              <Separator />

              {/* Information We Collect */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  2. Information We Collect
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  We collect several types of information from and about users of our Services,
                  including:
                </Text>

                <VStack gap={4} align="stretch" pl={4}>
                  <Box>
                    <Heading as="h3" size="md" mb={3}>
                      2.1 Personal Information
                    </Heading>
                    <List.Root gap={2}>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          <strong>Full Name:</strong> Required for booking identification and
                          communication purposes
                        </Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          <strong>Phone Number:</strong> Used for booking confirmations, reminders,
                          and customer support
                        </Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          <strong>Email Address:</strong> Optional; used for electronic
                          communications and booking receipts
                        </Text>
                      </List.Item>
                    </List.Root>
                  </Box>

                  <Box>
                    <Heading as="h3" size="md" mb={3}>
                      2.2 Booking Information
                    </Heading>
                    <List.Root gap={2}>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          Booking history, including dates, times, duration, and turf selection
                        </Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          Booking preferences and special requests
                        </Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          Cancellation and modification records
                        </Text>
                      </List.Item>
                    </List.Root>
                  </Box>

                  <Box>
                    <Heading as="h3" size="md" mb={3}>
                      2.3 Payment Information
                    </Heading>
                    <Text color="gray.700" lineHeight="tall">
                      We collect payment information necessary to process your bookings. However,
                      we do not store full credit card or debit card information on our servers.
                      Payment processing is handled by our third-party payment processor, PayFast,
                      which maintains PCI DSS compliance standards. Information collected includes:
                    </Text>
                    <List.Root gap={2} mt={2}>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          Transaction amounts and dates
                        </Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          Payment method type (e.g., credit card, bank transfer)
                        </Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          Transaction status and confirmation numbers
                        </Text>
                      </List.Item>
                    </List.Root>
                  </Box>

                  <Box>
                    <Heading as="h3" size="md" mb={3}>
                      2.4 Technical Information
                    </Heading>
                    <List.Root gap={2}>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          IP address, browser type, and device information
                        </Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          Usage data, including pages visited and time spent on the platform
                        </Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator asChild color="green.500" mt={1}>
                          <CheckCircle />
                        </List.Indicator>
                        <Text color="gray.700">
                          Cookies and similar tracking technologies
                        </Text>
                      </List.Item>
                    </List.Root>
                  </Box>
                </VStack>
              </Box>

              <Separator />

              {/* How We Use Your Information */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  3. How We Use Your Information
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  We use the information we collect for the following purposes:
                </Text>
                <List.Root gap={3}>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Service Delivery:</strong> To process and manage your turf bookings,
                      send confirmations, and provide customer support
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Communication:</strong> To send booking reminders, updates,
                      cancellation notices, and respond to your inquiries
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Payment Processing:</strong> To facilitate secure payment
                      transactions through our payment processor
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Service Improvement:</strong> To analyze usage patterns, improve our
                      platform functionality, and enhance user experience
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Marketing:</strong> To send promotional offers, newsletters, and
                      updates about our services (with your consent, where required)
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Legal Compliance:</strong> To comply with applicable laws,
                      regulations, and legal processes
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Security:</strong> To detect, prevent, and address fraud, security
                      breaches, and technical issues
                    </Text>
                  </List.Item>
                </List.Root>
              </Box>

              <Separator />

              {/* Data Retention */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  4. Data Retention
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  We retain your personal information for as long as necessary to fulfill the
                  purposes outlined in this Privacy Policy, unless a longer retention period is
                  required or permitted by law. Specifically:
                </Text>
                <List.Root gap={3}>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Account Information:</strong> Retained for the duration of your
                      account's active status and for 3 years after account closure
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Booking Records:</strong> Maintained for 5 years for accounting,
                      tax, and legal compliance purposes
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Payment Information:</strong> Transaction records retained for 7
                      years as required by financial regulations
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Technical Data:</strong> Typically retained for 24 months or as
                      required for analytical purposes
                    </Text>
                  </List.Item>
                </List.Root>
                <Text color="gray.700" lineHeight="tall" mt={4}>
                  After the retention period expires, we will securely delete or anonymize your
                  personal information in accordance with applicable data protection laws.
                </Text>
              </Box>

              <Separator />

              {/* Third-Party Services */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  5. Third-Party Service Providers
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  We may share your information with trusted third-party service providers who
                  assist us in operating our platform and delivering our Services. These providers
                  are contractually obligated to protect your information and use it only for the
                  purposes we specify.
                </Text>

                <Box pl={4}>
                  <Heading as="h3" size="md" mb={3}>
                    5.1 Payment Processor - PayFast
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={3}>
                    We use PayFast as our payment processing partner to handle all financial
                    transactions securely. When you make a payment through our platform:
                  </Text>
                  <List.Root gap={2}>
                    <List.Item display="flex" alignItems="flex-start">
                      <List.Indicator asChild color="green.500" mt={1}>
                        <CheckCircle />
                      </List.Indicator>
                      <Text color="gray.700">
                        Your payment information is transmitted directly to PayFast's secure
                        servers
                      </Text>
                    </List.Item>
                    <List.Item display="flex" alignItems="flex-start">
                      <List.Indicator asChild color="green.500" mt={1}>
                        <CheckCircle />
                      </List.Indicator>
                      <Text color="gray.700">
                        PayFast processes your payment in compliance with PCI DSS standards
                      </Text>
                    </List.Item>
                    <List.Item display="flex" alignItems="flex-start">
                      <List.Indicator asChild color="green.500" mt={1}>
                        <CheckCircle />
                      </List.Indicator>
                      <Text color="gray.700">
                        We receive only transaction confirmation details, not your full payment
                        card information
                      </Text>
                    </List.Item>
                    <List.Item display="flex" alignItems="flex-start">
                      <List.Indicator asChild color="green.500" mt={1}>
                        <CheckCircle />
                      </List.Indicator>
                      <Text color="gray.700">
                        PayFast's use of your information is governed by their own privacy policy
                      </Text>
                    </List.Item>
                  </List.Root>
                </Box>

                <Box pl={4} mt={4}>
                  <Heading as="h3" size="md" mb={3}>
                    5.2 Other Service Providers
                  </Heading>
                  <Text color="gray.700" lineHeight="tall" mb={2}>
                    We may also work with:
                  </Text>
                  <List.Root gap={2}>
                    <List.Item display="flex" alignItems="flex-start">
                      <List.Indicator asChild color="green.500" mt={1}>
                        <CheckCircle />
                      </List.Indicator>
                      <Text color="gray.700">
                        SMS and email service providers for communications
                      </Text>
                    </List.Item>
                    <List.Item display="flex" alignItems="flex-start">
                      <List.Indicator asChild color="green.500" mt={1}>
                        <CheckCircle />
                      </List.Indicator>
                      <Text color="gray.700">
                        Cloud hosting and storage providers for data security
                      </Text>
                    </List.Item>
                    <List.Item display="flex" alignItems="flex-start">
                      <List.Indicator asChild color="green.500" mt={1}>
                        <CheckCircle />
                      </List.Indicator>
                      <Text color="gray.700">
                        Analytics providers to understand platform usage
                      </Text>
                    </List.Item>
                  </List.Root>
                </Box>
              </Box>

              <Separator />

              {/* Your Rights */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  6. Your Privacy Rights
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  You have certain rights regarding your personal information. Depending on your
                  location, these may include:
                </Text>
                <List.Root gap={3}>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Right to Access:</strong> You may request a copy of the personal
                      information we hold about you
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Right to Correction:</strong> You may request that we correct any
                      inaccurate or incomplete information
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Right to Deletion:</strong> You may request deletion of your
                      personal information, subject to legal retention requirements
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Right to Object:</strong> You may object to certain processing of
                      your personal information, including marketing communications
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Right to Data Portability:</strong> You may request a copy of your
                      data in a structured, machine-readable format
                    </Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator asChild color="green.500" mt={1}>
                      <CheckCircle />
                    </List.Indicator>
                    <Text color="gray.700">
                      <strong>Right to Withdraw Consent:</strong> Where we rely on consent, you
                      may withdraw it at any time
                    </Text>
                  </List.Item>
                </List.Root>
                <Text color="gray.700" lineHeight="tall" mt={4}>
                  To exercise any of these rights, please contact us using the information provided
                  in the "Contact Us" section below. We will respond to your request within 30 days
                  of receipt.
                </Text>
              </Box>

              <Separator />

              {/* Data Security */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  7. Data Security
                </Heading>
                <Text color="gray.700" lineHeight="tall">
                  We implement appropriate technical and organizational security measures to
                  protect your personal information against unauthorized access, alteration,
                  disclosure, or destruction. These measures include encryption, secure server
                  infrastructure, access controls, and regular security assessments. However, no
                  method of transmission over the internet or electronic storage is 100% secure, and
                  we cannot guarantee absolute security.
                </Text>
              </Box>

              <Separator />

              {/* Children's Privacy */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  8. Children's Privacy
                </Heading>
                <Text color="gray.700" lineHeight="tall">
                  Our Services are not intended for individuals under the age of 18. We do not
                  knowingly collect personal information from children. If you are a parent or
                  guardian and believe your child has provided us with personal information, please
                  contact us immediately so we can delete such information.
                </Text>
              </Box>

              <Separator />

              {/* Changes to Privacy Policy */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  9. Changes to This Privacy Policy
                </Heading>
                <Text color="gray.700" lineHeight="tall">
                  We may update this Privacy Policy from time to time to reflect changes in our
                  practices, technology, legal requirements, or other factors. We will notify you of
                  any material changes by posting the new Privacy Policy on this page and updating
                  the "Last Updated" date. Your continued use of our Services after such
                  modifications constitutes your acknowledgment and acceptance of the updated
                  Privacy Policy.
                </Text>
              </Box>

              <Separator />

              {/* Contact Information */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  10. Contact Us
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or
                  our data practices, please contact us:
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
                  We aim to respond to all privacy-related inquiries within 48 hours.
                </Text>
              </Box>
            </VStack>
          </Box>
          {/* Footer Note */}
          <Box textAlign="center" color="gray.500" fontSize="sm">
            <Text>
              By using TurfKhana's services, you acknowledge that you have read and understood this
              Privacy Policy.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;