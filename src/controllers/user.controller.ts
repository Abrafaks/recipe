/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { matchedData } from "express-validator";
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
      const users = await userService.getUsers();

      if (!users) {
        res.status(StatusCodes.BAD_REQUEST).send();
      }

      return res.send(users);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async readCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.user!;
      const user = await userService.getCurrentUser(_id);
      if (user) {
        return res.send(user);
      }
      return res.status(StatusCodes.NOT_FOUND).send();
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
      let result;
      const existingUser = await userService.getUserByEmail(email);

      if (existingUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errorMessage: "Account with this email already exists." });
      }

      result = await userService.createNewUser(email, password);

      if (result) {
        return res.status(StatusCodes.CREATED).send(result);
      }
      return res.status(StatusCodes.BAD_REQUEST).send();
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async deleteUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id: userToDelete } = matchedData(req);
      const { _id: userId, isAdmin } = req.user!;

      const result = await userService.deleteUser(
        userToDelete,
        userId,
        isAdmin
      );
      if (result) {
        return res.status(StatusCodes.NO_CONTENT).send();
      } else {
        return res.status(StatusCodes.BAD_REQUEST).send();
      }
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}

export default new UserController(userService);
