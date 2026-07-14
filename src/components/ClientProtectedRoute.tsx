import React from "react";
import { Navigate } from "react-router-dom";

const ClientProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isClientLoggedIn = localStorage.getItem("isClientLoggedIn") === "true";

  if (!isClientLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ClientProtectedRoute;
