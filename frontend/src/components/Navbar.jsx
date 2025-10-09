// src/components/Navbar.jsx
import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import { useGetProfileQuery, useLogoutUserMutation } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch logged-in user
  const { data: user, isLoading, isError } = useGetProfileQuery();

  // Logout mutation
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      navigate("/login"); // redirect after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoading) return null; // don't show navbar while loading
  if (isError || !user) return null; // hide if no user

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#222",
        color: "#fff",
      }}
    >
      <h2>Dashboard</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <FiUser
          style={{ cursor: "pointer" }}
          onClick={() => setShowModal(true)}
          title="Show Profile"
          size={22}
        />
        <button
          onClick={handleLogout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Profile Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              color: "#000",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <h3>User Details</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            {user?.name && <p><strong>Name:</strong> {user.name}</p>}

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "15px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
