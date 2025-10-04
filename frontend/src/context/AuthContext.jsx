import React, { createContext, useState, useEffect } from "react";
import { getProfile, refreshToken, logoutUser } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        // try refresh token if profile fails
        try {
          await refreshToken();
          const profile = await getProfile();
          setUser(profile);
        } catch (_) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
   navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
