import * as mongoose from "mongoose";

export interface User {
  email: string;
  passwordHash: string;
  admin: string;
}

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  admin: { type: Boolean, required: true, default: 0 },
});

export const User = mongoose.model<User>("user", userSchema);
