/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";
import { LeanDocument } from "mongoose";
import { RecipeDocument } from "src/models/recipe.model";
import { UserDocument } from "src/models/user.model";
import { Webhook, WebhookDocument } from "../models/webhook.model";

interface WebhookQuery {
  userId: string;
  url: string;
}

interface RecipeWithEvent {
  event: string;
  recipe?: LeanDocument<RecipeDocument>;
  recipeId?: string;
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

  public async deleteWebhook(
    webhookId: string,
    userId: string
  ): Promise<boolean> {
    const updated = await Webhook.deleteOne({ _id: webhookId, userId });

    if (updated.deletedCount === 1) {
      return true;
    }
    return false;
  }

  public async webhookHandler(
    userId: string,
    event: string,
    recipe: RecipeDocument | null,
    recipeId?: string
  ): Promise<boolean> {
    const webhooks = await this.getWebhooks(userId);
    let recipeWithEvent: RecipeWithEvent;
    if (webhooks.length > 0) {
      if (recipe) {
        const newRecipe = recipe.toJSON();

        recipeWithEvent = {
          ...newRecipe,
          event,
        };
      } else {
        recipeWithEvent = {
          recipeId,
          event,
        };
      }

      webhooks.map(async (webhook) => {
        const response = await axios.post(`${webhook.url}`, recipeWithEvent);
      });

      return true;
    }
    return false;
  }
}

export default new WebhookService();
