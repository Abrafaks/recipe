/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import webhookService, { WebhookService } from "../services/webhook.service";

interface UserAuthData {
  email: string;
  password: string;
}

export class WebhookController {
  constructor(private userService: WebhookService) {}

  public async addWebhook(req: Request, res: Response): Promise<Response> {
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

      const result = await userService.deleteUser(
        userToDelete,
        userId,
        isAdmin
      );
      if (result) {
        return res.sendStatus(StatusCodes.NO_CONTENT);
      } else {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
      }
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new WebhookController(webHookService);
