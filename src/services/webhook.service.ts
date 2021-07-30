/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

  public async getWebhookById(
    webhookId: string
  ): Promise<WebhookDocument | null> {
    return Webhook.findById(webhookId);
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

  public async updateWebhook(
    webhookId: string,
    userId: string,
    url: string
  ): Promise<WebhookDocument | null> {
    const updated = await Webhook.updateOne(
      { _id: webhookId, userId },
      { url }
    );

    if (updated.nModified === 1) {
      return this.getWebhookById(webhookId);
    }
    return null;
  }
}

export default new WebhookService();
