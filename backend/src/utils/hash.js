import argon2 from "argon2";
import crypto from "crypto";

// password hashing
export async function hashPassword(password) {
  return await argon2.hash(password);
}
export async function verifyPassword(hash, password) {
  return await argon2.verify(hash, password);
}

// refresh token hashing (fast hash)
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
