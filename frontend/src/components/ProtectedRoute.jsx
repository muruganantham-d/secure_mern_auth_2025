// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useGetProfileQuery } from "../store/apiSlice";

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading, isError, error } = useGetProfileQuery();

  if (isLoading) return <p>Loading...</p>;

  if (isError || !user) {
    // If token expired or no user data, redirect to login
    if (error?.status === 401) {
      return <Navigate to="/login" replace />;
    }
    return <p>Something went wrong.</p>;
  }

  return children;
};

export default ProtectedRoute;
