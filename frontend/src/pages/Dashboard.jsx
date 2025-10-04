import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h3>Welcome back, {user?.name || user?.email}</h3>
        <p>This is your dashboard content.</p>
      </div>
    </div>
  );
};

export default Dashboard;
