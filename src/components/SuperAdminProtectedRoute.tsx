import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import { APP_BASE_URL } from "../utils/api";

const SuperAdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<"checking" | "authed" | "guest">(
    "checking",
  );

  useEffect(() => {
    fetch(`${APP_BASE_URL}/super-admins/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("superAdmin", JSON.stringify(data.superAdmin));
        setStatus("authed");
      })
      .catch(() => {
        localStorage.removeItem("superAdmin");
        setStatus("guest");
      });
  }, []);

  if (status === "checking") {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (status === "guest") {
    return <Navigate to="/super-admin/login" replace />;
  }

  return <>{children}</>;
};

export default SuperAdminProtectedRoute;
