import * as mongoose from "mongoose";

export interface User {
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  _id: string;
}

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

export const User = mongoose.model<User>("user", userSchema);
