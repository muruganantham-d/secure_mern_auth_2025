import express from "express";
import { register, login, refreshToken, logout, getProfile } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// ✅ Profile route was included
router.get("/profile",requireAuth, getProfile);

export default router;
