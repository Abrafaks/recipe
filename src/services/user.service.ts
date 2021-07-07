import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/user.model";

export function unsetCookie(req: Request, res: Response): Response {
  return res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
}

// user will be null if there isn't
// this email is db => account can be registered
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await User.findOne({ email });
  return user;
}

export async function hashPassword(
  password: string,
  salt: number
): Promise<string> {
  return await bcrypt.hash(password, salt);
}
