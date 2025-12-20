import LandingPage from "./LandingPage";
import BookingFormPage from "./bookings/BookingFormPage";
import BookingConfirmationPage from "./bookings/BookingConfirmationPage";
import AdminCalendarPage from "./owners/AdminCalendarPage";
import AdminBookingListPage from "./owners/AdminBookingListPage";
import PrivacyPolicyPage from "./policies/PrivacyPolicyPage";
import RefundCancellationPolicyPage from "./policies/RefundCancellationPolicyPage";
import DashboardPage from "./owners/DashboardPage";
import LoginPage from "./owners/LoginPage";
import TurfDetailsPage from "./turfs/TurfDetailsPage";
import AdminSettingsPage from "./owners/AdminSettingsPage";
import TermsConditionsPage from "./policies/TermsConditionsPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import AdminOverviewPage from "./owners/AdminOverviewPage";

function App() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/dashboard");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/turf-details/:id" element={<TurfDetailsPage />} />
        <Route path="/booking-form/:id" element={<BookingFormPage />} />
        <Route
          path="/booking-confirmation/:id"
          element={<BookingConfirmationPage />}
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="calendar" element={<AdminCalendarPage />} />
          <Route path="booking-list" element={<AdminBookingListPage />} />
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
