import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS: allow credentials & origin
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);

// protected route example
app.get("/api/profile", requireAuth, (req, res) => {
  // req.user set by auth middleware
  res.json({ message: "This is protected", user: req.user });
});

export default app;
