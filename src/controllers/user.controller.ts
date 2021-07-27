/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userService, { UserService } from "../services/user.service";

interface UserAuthData {
  email: string;
  password: string;
}

export class UserController {
  constructor(private userService: UserService) {}

  public async readAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.user!;

      const users = await userService.getUsers();

      if (!users) {
        res.status(StatusCodes.BAD_REQUEST).send();
      }

      return res.send(users);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { _id, isAdmin } = req.user!;

      const token = userService.createToken(_id, isAdmin);

      return res.send({ token });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as UserAuthData;

      const existingUser = await userService.getUserByEmail(email);

      if (existingUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errorMessage: "Account with this email already exists." });
      }

      return res.send(
        await userService.createUserAndReturnToken(email, password)
      );
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}

export default new UserController(userService);
