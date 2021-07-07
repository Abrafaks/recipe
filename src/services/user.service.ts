import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/user.model";

export function setCookie(res: Response, token: string): Response {
  return res
    .cookie("token", token, {
      httpOnly: true,
    })
    .send();
}

export function unsetCookie(res: Response): Response {
  return res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
}

// user will be null if there isn't
// this email in db => account can be registered
export async function getUserByEmail(email: string): Promise<User | null> {
  return await User.findOne({ email });
}

export async function hashPassword(
  password: string,
  salt: number
): Promise<string> {
  return await bcrypt.hash(password, salt);
}

export async function createUser(
  email: string,
  passwordHash: string
): Promise<User> {
  const user = new User({ email, passwordHash });

  return await user.save();
}

export function createToken(userId: string, isAdmin: boolean): string {
  return jwt.sign(
    {
      userId,
      isAdmin,
    },
    process.env.JWT!
  );
}

export async function arePasswordsMatching(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
