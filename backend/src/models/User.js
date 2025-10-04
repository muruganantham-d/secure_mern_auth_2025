import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  replacedByTokenHash: { type: String, default: null } // for rotation chain
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  // store multiple refresh tokens (allow multi-device) — hashed
  refreshTokens: [RefreshTokenSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
