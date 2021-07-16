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
      const { _id, isAdmin } = req.user!;

      const token = userService.createToken(_id, isAdmin);

      return res.send({ token });
    } catch (err) {
      return res.status(500).send();
    }
  }

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as UserAuthData;

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
