import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

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
        {user && (
          <>
            <FiUser
              style={{ cursor: "pointer" }}
              onClick={() => setShowModal(true)}
              title="Show Profile"
              size={22}
            />
            <button
              onClick={logout}
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
          </>
        )}
      </div>

      {/* Modal */}
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
