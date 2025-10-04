import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  try {
    // Access token is sent as HttpOnly cookie named 'accessToken'
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const payload = verifyAccessToken(token);
    req.user = payload; // { userId, email, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
