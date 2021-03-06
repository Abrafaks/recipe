/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import webhookService, { WebhookService } from "../services/webhook.service";

export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  public async addWebhook(req: Request, res: Response): Promise<Response> {
    try {
      const { _id: userId } = req.user!;
      const { url } = matchedData(req);

      const existingWebhook = await webhookService.getWebhook({
        userId,
        url,
      });

      if (existingWebhook) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ error: "Webhook with this url exists for this user." });
      }

      const result = await webhookService.addWebhook(userId, url);

      return res.status(StatusCodes.CREATED).send(result);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async getWebhooks(req: Request, res: Response): Promise<Response> {
    try {
      const { _id: userId, isAdmin } = req.user!;
      const { userId: readUserId } = matchedData(req);

      const result = await webhookService.getWebhooks(
        userId,
        readUserId,
        isAdmin
      );
      if (result) {
        return res.send(result);
      }

      return res.status(StatusCodes.FORBIDDEN).send();
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateWebhook(req: Request, res: Response): Promise<Response> {
    const { _id: userId, isAdmin } = req.user!;
    const { url, webhookId } = matchedData(req);

    try {
      const updatedWebhook = await webhookService.updateWebhook(
        webhookId,
        userId,
        url,
        isAdmin
      );

      if (updatedWebhook.FORBIDDEN) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }

      if (updatedWebhook.NOT_FOUND) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      if (!updatedWebhook.OK || !updatedWebhook.webhook) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
      return res.send(updatedWebhook.webhook);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteWebhook(req: Request, res: Response): Promise<Response> {
    const { _id: userId, isAdmin } = req.user!;
    const { webhookId } = matchedData(req);

    try {
      const deletedWebhook = await webhookService.deleteWebhook(
        webhookId,
        userId,
        isAdmin
      );

      if (deletedWebhook.NOT_FOUND) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      if (deletedWebhook.FORBIDDEN) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }

      if (deletedWebhook.OK) {
        return res.send();
      }

      return res.sendStatus(StatusCodes.BAD_REQUEST);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new WebhookController(webhookService);
