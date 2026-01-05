import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Separator,
  List,
  Alert,
  AlertDescription,
  Link,
} from '@chakra-ui/react';
import { CheckCircle, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';
import { useColorModeValue } from '../components/ui/color-mode';

const TermsConditionsPage: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" bg={bgColor} py={{ base: 8, md: 16 }}>
      <Container maxW="container.lg">
        <VStack gap={8} align="stretch">
          <Box textAlign="center" mb={6}>
            <Heading as="h1" size="2xl" mb={4} color="green.500">
              Terms & Conditions
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Last Updated: December 13, 2025
            </Text>
          </Box>

          <Alert.Root status="info" borderRadius="lg">
            <Alert.Indicator />
            <AlertDescription>
              These Terms constitute a legally binding agreement. By using TurfKhana, you agree to these Terms.
            </AlertDescription>
          </Alert.Root>

          <Box bg={cardBg} p={{ base: 6, md: 10 }} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
            <VStack gap={8} align="stretch">

              <Box>
                <Heading as="h2" size="lg" mb={4}>1. Definitions</Heading>
                <List.Root gap={2}>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700"><strong>"TurfKhana"</strong> refers to our company and services</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700"><strong>"User"</strong> refers to anyone using our platform</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700"><strong>"Services"</strong> refers to our booking platform and related services</Text></List.Item>
                </List.Root>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>2. Use of System</Heading>
                <VStack gap={4} align="stretch" pl={4}>
                  <Box>
                    <Heading as="h3" size="md" mb={3}>2.1 Account Registration</Heading>
                    <List.Root gap={2}>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">You must provide accurate information during registration</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">You are responsible for maintaining account security</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">Must be 18+ or have parental consent</Text>
                      </List.Item>
                    </List.Root>

                    <Heading as="h3" size="md" mb={3} mt={4}>2.2 Prohibited Activities</Heading>
                    <List.Root gap={2}>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={AlertTriangle} color="red.500" mt={1} />
                        <Text color="gray.700">No fraudulent bookings or payment chargebacks</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={AlertTriangle} color="red.500" mt={1} />
                        <Text color="gray.700">No automated systems or bots</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={AlertTriangle} color="red.500" mt={1} />
                        <Text color="gray.700">No harassment or abusive behavior</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={AlertTriangle} color="red.500" mt={1} />
                        <Text color="gray.700">No unauthorized access attempts</Text>
                      </List.Item>
                    </List.Root>
                  </Box>
                </VStack>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>3. Payment Terms</Heading>
                <List.Root gap={2}>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                    <Text color="gray.700">All prices are in Pakistani Rupees (PKR) including applicable taxes</Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                    <Text color="gray.700">Full payment required at booking confirmation</Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                    <Text color="gray.700">Payments processed securely through PayFast</Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                    <Text color="gray.700">Failed payments result in booking cancellation</Text>
                  </List.Item>
                  <List.Item display="flex" alignItems="flex-start">
                    <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                    <Text color="gray.700">You authorize charges to your payment method</Text>
                  </List.Item>
                </List.Root>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>4. Fair Usage Rules</Heading>
                <VStack gap={4} align="stretch" pl={4}>
                  <Box>
                    <Heading as="h3" size="md" mb={3}>4.1 Booking Limits</Heading>
                    <List.Root gap={2}>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">Maximum 5 active future bookings at once</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">Cannot book more than 30 days in advance</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">Mass booking or hoarding prohibited</Text>
                      </List.Item>
                    </List.Root>

                    <Heading as="h3" size="md" mb={3} mt={4}>4.2 Facility Usage</Heading>
                    <List.Root gap={2}>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">Arrive on time; late arrivals don't extend booking time</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">Respect facility rules and property</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">Do not exceed maximum capacity</Text>
                      </List.Item>
                      <List.Item display="flex" alignItems="flex-start">
                        <List.Indicator as={CheckCircle} color="green.500" mt={1} />
                        <Text color="gray.700">Vacate promptly at booking end</Text>
                      </List.Item>
                    </List.Root>
                  </Box>
                </VStack>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>5. Cancellation & Conduct Responsibilities</Heading>
                <Text color="gray.700" mb={3}>Cancellations are governed by our Refund & Cancellation Policy.</Text>

                <VStack gap={4} align="stretch" pl={4}>
                  <Box>
                    <Heading as="h3" size="md" mb={3}>5.1 User Conduct</Heading>
                    <List.Root gap={2}>
                      <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Behave respectfully to staff and other users</Text></List.Item>
                      <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">No abusive, threatening, or discriminatory behavior</Text></List.Item>
                      <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">No illegal activities at facilities</Text></List.Item>
                      <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Accept liability for damages caused by you or your group</Text></List.Item>
                    </List.Root>
                  </Box>
                </VStack>

                <Text color="gray.700" mt={3}>Misconduct may result in booking termination without refund, account suspension, and legal action.</Text>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>6. Limitation of Liability</Heading>
                <Text color="gray.700" mb={3}>Services provided "AS IS" without warranties. We are not liable for:</Text>
                <List.Root gap={2}>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Service interruptions or technical issues</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Third-party facility conditions or safety</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Injuries or accidents at facilities</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Disputes with facility owners</Text></List.Item>
                </List.Root>
                <Text color="gray.700" mt={3} fontWeight="semibold">Maximum liability: Lesser of PKR 10,000 or amount paid in last 12 months.</Text>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>7. Indemnification</Heading>
                <Text color="gray.700">You agree to indemnify TurfKhana from claims arising from your use of Services, violation of Terms, conduct at facilities, or violation of others' rights.</Text>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>8. Dispute Resolution</Heading>
                <VStack gap={4} align="stretch" pl={4}>
                  <Box>
                    <Heading as="h3" size="md" mb={3}>8.1 Informal Resolution</Heading>
                    <Text color="gray.700" mb={3}>Contact ajcodzhq@gmail.com first. We'll work to resolve within 30 days.</Text>

                    <Heading as="h3" size="md" mb={3}>8.2 Arbitration</Heading>
                    <Text color="gray.700" mb={3}>Unresolved disputes go to binding arbitration in Lahore under Pakistan's Arbitration Act, 1940.</Text>

                    <Heading as="h3" size="md" mb={3}>8.3 Class Action Waiver</Heading>
                    <Text color="gray.700">Disputes resolved individually only, not as class actions.</Text>
                  </Box>
                </VStack>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>9. Governing Law</Heading>
                <Text color="gray.700" mb={2}>These Terms are governed by the laws of Pakistan, specifically:</Text>
                <List.Root gap={2}>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Contract Act, 1872</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Electronic Transactions Ordinance, 2002</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Prevention of Electronic Crimes Act, 2016</Text></List.Item>
                </List.Root>
                <Text color="gray.700" mt={3}>Courts in Lahore, Pakistan have exclusive jurisdiction.</Text>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>10. Modifications to Terms</Heading>
                <Text color="gray.700">We may modify these Terms at any time. Changes effective upon posting. Continued use constitutes acceptance. Material changes will be notified via email or platform notification.</Text>
              </Box>

              <Separator />

              <Box>
                <Heading as="h2" size="lg" mb={4}>11. Termination</Heading>
                <Text color="gray.700" mb={3}>We may suspend or terminate your account for:</Text>
                <List.Root gap={2}>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Violation of these Terms</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Fraudulent activity or chargebacks</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Multiple no-shows</Text></List.Item>
                  <List.Item display="flex" alignItems="flex-start"><List.Indicator as={CheckCircle} color="green.500" mt={1} /><Text color="gray.700">Abusive behavior</Text></List.Item>
                </List.Root>
                <Text color="gray.700" mt={3}>You may terminate your account anytime through account settings.</Text>
              </Box>

              <Separator />

              {/* Contact Information */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  12. Contact Us
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  If you have any questions, concerns, or requests regarding this Terms & Conditions, please contact us:
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

                  <Box display="flex" alignItems="flex-start">
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
                        Model Town
                        <br />
                        Lahore, Punjab, Pakistan
                      </Text>
                    </Box>
                  </Box>
                </VStack>

                <Text color="gray.600" fontSize="sm" mt={4} fontStyle="italic">
                  We aim to respond to all terms & conditions related inquiries within 48 hours.
                </Text>
              </Box>

            </VStack>
          </Box>
          <Box textAlign="center" color="gray.500" fontSize="sm">
            <Text>By using TurfKhana's services, you acknowledge that you have read and understood these Terms & Conditions.</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TermsConditionsPage;