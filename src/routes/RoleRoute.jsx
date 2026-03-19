import React from "react";
import { Navigate } from "react-router";
import { useRole } from "../hooks/Role/useRole";

const RoleRoute = ({ allowedRoles, children }) => {
  const role = useRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
