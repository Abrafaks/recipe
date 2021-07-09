import { Request, Response } from "express";
import userService from "../services/user.service";

interface UserAuthData {
  email: string;
  password: string;
}

export class UserController {
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as UserAuthData;

      if (!email || !password) {
        return res
          .status(400)
          .json({ errorMessage: "Please enter all required data." });
      }

      const existingUser = await userService.getUserByEmail(email);

      if (!existingUser) {
        return res
          .status(401)
          .json({ errorMessage: "Wrong email or password." });
      }

      const passwordCorrect = userService.arePasswordsMatching(
        password,
        existingUser.passwordHash
      );

      if (!passwordCorrect) {
        return res
          .status(401)
          .json({ errorMessage: "Wrong email or password." });
      } else {
        const token = userService.createToken(
          existingUser._id,
          existingUser.isAdmin
        );

        return userService.setCookie(res, token);
      }
    } catch (err) {
      return res.status(500).send();
    }
  }

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as UserAuthData;

      if (!email || !password) {
        return res
          .status(400)
          .json({ errorMessage: "Please enter all required data." });
      }

      if (password.length < 8) {
        return res.status(400).json({
          errorMessage: "Password must be at least 8 characters long.",
        });
      }

      const existingUser = await userService.getUserByEmail(email);

      if (existingUser) {
        return res
          .status(400)
          .json({ errorMessage: "Account with this email already exists." });
      }

      const passwordHash = await userService.hashPassword(password, 10);

      const savedUser = await userService.createUser(email, passwordHash);

      const token = userService.createToken(savedUser._id, false);

      return userService.setCookie(res, token);
    } catch (err) {
      return res.status(500).send();
    }
  }

  public logout(req: Request, res: Response): Response {
    return userService.unsetCookie(res);
  }
}

export default new UserController();
