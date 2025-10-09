// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useLoginUserMutation, useGetProfileQuery } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [loginUser] = useLoginUserMutation();
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password }).unwrap();
            setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setMsg(err?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
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
