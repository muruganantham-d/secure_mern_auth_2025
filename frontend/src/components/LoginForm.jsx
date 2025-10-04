import React, { useState } from "react";
import { loginUser, getProfile } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });

      const profile = await getProfile(); // profile object
      setUser(profile);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setMsg(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <p>
        Not have an account? <a href="/register">Register</a>
      </p>
      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </form>
  );
};

export default LoginForm;
