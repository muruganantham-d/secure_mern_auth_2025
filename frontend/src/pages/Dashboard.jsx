// src/pages/Dashboard.jsx
import React from "react";
import { useGetProfileQuery, useLogoutUserMutation } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: profile, error, isLoading } = useGetProfileQuery();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser().unwrap();
    navigate("/login");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    if (error?.status === 401) {
      navigate("/login");
      return null;
    }
    return <p>Failed to fetch profile</p>;
  }

  return (
    <div>
      <h2>Welcome, {profile?.name}</h2>
      <p>Email: {profile?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
