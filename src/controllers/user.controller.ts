import { Request, Response } from "express";
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

    const existingUser = await user_services.getUserByEmail(email);

    if (!existingUser) {
      return res.status(403).json({ errorMessage: "Wrong email or password." });
    }

    const passwordCorrect = user_services.arePasswordsMatching(
      password,
      existingUser.passwordHash
    );

    if (!passwordCorrect) {
      return res.status(403).json({ errorMessage: "Wrong email or password." });
    } else {
      //log in the user via token

      const token = user_services.createToken(
        existingUser._id,
        existingUser.isAdmin
      );

      // sending cookie in HTTP-only cookie
      return user_services.setCookie(res, token);
    }
  } catch (err) {
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
        .status(409)
        .json({ errorMessage: "Account with this email already exists." });
    }

    const passwordHash = await user_services.hashPassword(password, 10);

    const savedUser = await user_services.createUser(email, passwordHash);

    //log in the user via token

    const token = user_services.createToken(savedUser._id, false);

    // sending cookie in HTTP-only cookie
    return user_services.setCookie(res, token);
  } catch (err) {
    return res.status(500).send();
  }
}

export function logout(req: Request, res: Response): Response {
  return user_services.unsetCookie(res);
}
