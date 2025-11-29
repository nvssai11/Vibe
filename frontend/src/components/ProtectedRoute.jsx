import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    // Show a loader while auth state is being fetched
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !["apartment_admin", "super_admin"].includes(currentUser.role)) {
    // Logged in but not admin
    return <Navigate to="/" replace />;
  }

  // All checks passed
  return children;
};

export default ProtectedRoute;
