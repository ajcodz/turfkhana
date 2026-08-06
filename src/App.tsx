import LandingPage from "./LandingPage";
import BookingFormPage from "./bookings/BookingFormPage";
import BookingConfirmationPage from "./bookings/BookingConfirmationPage";
import BookingFailurePage from "./bookings/BookingFailurePage";
import SuperAdminLoginPage from "./superAdmin/SuperAdminLoginPage";
import SuperAdminDashboardPage from "./superAdmin/SuperAdminDashboardPage";
import SuperAdminOwnerListPage from "./superAdmin/SuperAdminOwnerListPage";
import SuperAdminTurfListPage from "./superAdmin/SuperAdminTurfListPage";
import SuperAdminBookingListPage from "./superAdmin/SuperAdminBookingListPage";
import SuperAdminAuditLogPage from "./superAdmin/SuperAdminAuditLogPage";
import SuperAdminProtectedRoute from "./components/SuperAdminProtectedRoute";
import AdminProfilePage from "./owners/AdminProfilePage";
import AdminCalendarPage from "./owners/AdminCalendarPage";
import AdminBookingListPage from "./owners/AdminBookingListPage";
import AdminTurfListPage from "./owners/AdminTurfListPage";
import PrivacyPolicyPage from "./policies/PrivacyPolicyPage";
import RefundCancellationPolicyPage from "./policies/RefundCancellationPolicyPage";
import DashboardPage from "./owners/DashboardPage";
import LoginPage from "./owners/LoginPage";
import TurfDetailsPage from "./turfs/TurfDetailsPage";
import BrowseTurfsPage from "./turfs/BrowseTurfsPage";
import AdminSettingsPage from "./owners/AdminSettingsPage";
import TermsConditionsPage from "./policies/TermsConditionsPage";
import ClientLoginPage from "./clients/ClientLoginPage";
import ClientSignupPage from "./clients/ClientSignupPage";
import ClientPastBookingsPage from "./clients/ClientPastBookingsPage";
import ClientProtectedRoute from "./components/ClientProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, useLocation } from "react-router-dom";
import AdminOverviewPage from "./owners/AdminOverviewPage";

function App() {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/super-admin");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/turfs" element={<BrowseTurfsPage />} />
        <Route path="/turf-details/:id" element={<TurfDetailsPage />} />
        <Route path="/booking-form/:id" element={<BookingFormPage />} />
        <Route
          path="/booking-confirmation/:id"
          element={<BookingConfirmationPage />}
        />
        <Route path="/booking-failure" element={<BookingFailurePage />} />

        {/* Client routes */}
        <Route path="/login" element={<ClientLoginPage />} />
        <Route path="/signup" element={<ClientSignupPage />} />
        <Route
          path="/past-bookings"
          element={
            <ClientProtectedRoute>
              <ClientPastBookingsPage />
            </ClientProtectedRoute>
          }
        />

        {/* Super Admin routes */}
        <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
        <Route
          path="/super-admin/dashboard"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminDashboardPage />
            </SuperAdminProtectedRoute>
          }
        >
          <Route index element={<SuperAdminOwnerListPage />} />
          <Route path="turfs" element={<SuperAdminTurfListPage />} />
          <Route path="bookings" element={<SuperAdminBookingListPage />} />
          <Route path="audit-log" element={<SuperAdminAuditLogPage />} />
        </Route>

        {/* Owner/Admin routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="calendar" element={<AdminCalendarPage />} />
          <Route path="booking-list" element={<AdminBookingListPage />} />
          <Route path="turf-list" element={<AdminTurfListPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route
          path="/refund-and-cancellation-policy"
          element={<RefundCancellationPolicyPage />}
        />
        <Route
          path="/terms-and-conditions-policy"
          element={<TermsConditionsPage />}
        />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

export default App;
