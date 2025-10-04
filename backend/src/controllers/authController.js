import User from "../models/User.js";
import { hashPassword, verifyPassword, hashToken } from "../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { v4 as uuidv4 } from "uuid";
import ms from "ms"; // optional if you like human-readable durations (or compute manually)
import dotenv from "dotenv";
dotenv.config();

const REFRESH_EXPIRES_MS = (() => {
  // fallback: 7 days -> 7*24*60*60*1000
  return 7 * 24 * 60 * 60 * 1000;
})();

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    // secure: isProd,
     secure: false,   // always false in dev
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
    // maxAge set per cookie below
  };
}

export async function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "User already exists" });

  const passwordHash = await hashPassword(password);
  const user = new User({ email, passwordHash, name });
  await user.save();
  return res.status(201).json({ message: "User created" });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  // create tokens
  const accessToken = signAccessToken({ userId: user._id, email: user.email });
  const refreshToken = signRefreshToken({ userId: user._id, tokenId: uuidv4() });

  // store hashed refresh token with expiry
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);
  user.refreshTokens.push({ tokenHash, expiresAt });
  await user.save();

  // set cookies
  res.cookie("accessToken", accessToken, { ...cookieOptions(), maxAge: 15 * 60 * 1000 }); // 15m
  res.cookie("refreshToken", refreshToken, { ...cookieOptions(), maxAge: REFRESH_EXPIRES_MS });

  return res.json({ message: "Logged in" });
}

export async function refreshToken(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefreshToken(token); // {userId, tokenId, iat, exp}
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    const tokenHash = hashToken(token);

    // find token record
    const tokenRecord = user.refreshTokens.find(rt => rt.tokenHash === tokenHash);
    if (!tokenRecord) {
      // possible reuse/compromise — revoke all refresh tokens for safety
      user.refreshTokens = []; // revoke all
      await user.save();
      return res.status(401).json({ message: "Refresh token not recognized; tokens revoked" });
    }

    // rotation: remove the used token and issue a new refresh token
    user.refreshTokens = user.refreshTokens.filter(rt => rt.tokenHash !== tokenHash);

    const newRefreshToken = signRefreshToken({ userId: user._id, tokenId: uuidv4() });
    const newHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);
    user.refreshTokens.push({ tokenHash: newHash, expiresAt });

    await user.save();

    const newAccessToken = signAccessToken({ userId: user._id, email: user.email });

    res.cookie("accessToken", newAccessToken, { ...cookieOptions(), maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", newRefreshToken, { ...cookieOptions(), maxAge: REFRESH_EXPIRES_MS });

    return res.json({ message: "Tokens rotated" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        const user = await User.findById(payload.userId);
        if (user) {
          // remove the specific refresh token
          const tokenHash = hashToken(token);
          user.refreshTokens = user.refreshTokens.filter(rt => rt.tokenHash !== tokenHash);
          await user.save();
        }
      } catch (_) {
        // ignore invalid token
      }
    }

    // clear cookies
    res.clearCookie("accessToken", cookieOptions());
    res.clearCookie("refreshToken", cookieOptions());
    return res.json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export const getProfile = async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      email: req.user.email
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

