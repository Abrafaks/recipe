import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import * as user_services from "../services/user.service";

interface UserAuthData {
  email: string;
  password: string;
}

export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body as UserAuthData;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required data." });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordCorrect) {
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    } else {
      //log in the user via token

      const token = jwt.sign(
        {
          userId: existingUser._id,
          isAdmin: existingUser.isAdmin,
        },
        process.env.JWT!
      );

      // sending cookie in HTTP-only cookie
      return res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body as UserAuthData;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required data." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ errorMessage: "Password must be at least 8 characters long." });
    }

    const existingUser = await user_services.getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: "Account with this email already exists." });
    }

    const passwordHash = await user_services.hashPassword(password, 10);

    const savedUser = await user_services.createUser(email, passwordHash);

    //log in the user via token

    const token = user_services.createToken(savedUser._id, false);

    // sending cookie in HTTP-only cookie
    return user_services.setCookie(res, token);
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

export function logout(req: Request, res: Response): Response {
  return user_services.unsetCookie(req, res);
}
