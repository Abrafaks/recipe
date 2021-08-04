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
        res.sendStatus(StatusCodes.BAD_REQUEST);
      }

      return res.send(users);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async readCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.user!;
      const user = await userService.getCurrentUser(_id);

      return res.send(user);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { _id, isAdmin } = req.user!;

      const token = userService.createToken(_id, isAdmin);

      return res.send({ token });
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id: userToDelete } = matchedData(req);
      const { _id: userId, isAdmin } = req.user!;

      const deletedUser = await userService.deleteUser(
        userToDelete,
        userId,
        isAdmin
      );

      if (deletedUser.FORBIDDEN) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }

      if (deletedUser.NOT_FOUND) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      if (deletedUser.OK) {
        return res.send();
      }

      return res.sendStatus(StatusCodes.BAD_REQUEST);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new UserController(userService);
