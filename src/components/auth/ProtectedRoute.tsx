
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "../ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"admin" | "teacher">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page, save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user is admin but trying to access teacher routes, redirect to admin dashboard
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // If user is teacher but trying to access admin routes, redirect to teacher dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
