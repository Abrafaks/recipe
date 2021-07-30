/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserDocument } from "../models/user.model";
import { Webhook, WebhookDocument } from "../models/webhook.model";

interface WebhookQuery {
  userId: string;
  url: string;
}

export class WebhookService {
  public async getWebhook(
    query: WebhookQuery
  ): Promise<WebhookDocument | null> {
    return Webhook.findOne(query);
  }

  public async getWebhooks(userId: string): Promise<WebhookDocument[]> {
    return Webhook.find({ userId });
  }

  public async addWebhook(
    userId: string,
    url: string
  ): Promise<WebhookDocument> {
    const webhook = new Webhook({
      userId,
      url,
    });

    return webhook.save();
  }
}

export default new WebhookService();
