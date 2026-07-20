import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<"checking" | "authed" | "guest">(
    "checking",
  );

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/owners/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("owner", JSON.stringify(data.owner));
        setStatus("authed");
      })
      .catch(() => {
        localStorage.removeItem("owner");
        setStatus("guest");
      });
  }, []);

  if (status === "checking") {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="green.500" />
      </Flex>
    );
  }

  if (status === "guest") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
