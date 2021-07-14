import { Request, Response } from "express";
import userService, { UserService } from "../services/user.service";

interface UserAuthData {
  email: string;
  password: string;
}

export class UserController {
  constructor(private userService: UserService) {}

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

      const passwordCorrect = await userService.arePasswordsMatching(
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

        return res.send({ existingUser, token });
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

      return res.send(
        await userService.createUserAndReturnToken(email, password)
      );
    } catch (err) {
      return res.status(500).send();
    }
  }
}

export default new UserController(userService);
