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

      if (result) {
        return res.status(StatusCodes.CREATED).send(result);
      }
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    } catch (err) {
      console.log(err);
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async readWebhooks(req: Request, res: Response): Promise<Response> {
    try {
      const { _id: userId } = req.user!;

      const result = await webhookService.getWebhooks(userId);

      return res.send(result);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateWebhook(req: Request, res: Response): Promise<Response> {
    const { _id: userId } = req.user!;
    const { url, webhookId } = matchedData(req);

    try {
      const updatedWebhook = await webhookService.updateWebhook(
        webhookId,
        userId,
        url
      );

      if (updatedWebhook) {
        return res.send(updatedWebhook);
      }
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new WebhookController(webhookService);
