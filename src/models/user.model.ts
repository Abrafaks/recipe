import { Document, Schema, model } from "mongoose";

export interface User {
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}

export interface UserDocument extends User, Document {}

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

export const User = model<UserDocument>("user", userSchema);
