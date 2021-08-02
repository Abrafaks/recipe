/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";
import { LeanDocument } from "mongoose";
import { RecipeDocument } from "src/models/recipe.model";
import { User, UserDocument } from "src/models/user.model";
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
interface UpdateDeleteQuery {
  _id: string;
  userId?: string;
}

interface DeleteWebhookResult {
  NOT_FOUND: boolean;
  FORBIDDEN: boolean;
  OK: boolean;
}

interface UpdateWebhookResult extends DeleteWebhookResult {
  webhook?: WebhookDocument | null;
}
export class WebhookService {
  public async getWebhook(
    query: WebhookQuery
  ): Promise<WebhookDocument | null> {
    return Webhook.findOne(query);
  }

  public async getWebhooks(
    userId: string,
    readUserId: string,
    isAdmin: boolean
  ): Promise<WebhookDocument[] | null> {
    if (!isAdmin && userId.toString() !== readUserId) {
      return null;
    }
    return Webhook.find({ userId: readUserId });
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
    url: string,
    isAdmin: boolean
  ): Promise<UpdateWebhookResult> {
    let query: UpdateDeleteQuery = { _id: webhookId, userId };
    let updateWebhookResult: UpdateWebhookResult = {
      FORBIDDEN: false,
      NOT_FOUND: false,
      OK: false,
    };

    const webhook = await Webhook.findById(webhookId);

    if (!webhook) {
      updateWebhookResult.NOT_FOUND = true;
      return updateWebhookResult;
    }

    if (!isAdmin && webhook.userId !== userId.toString()) {
      updateWebhookResult.FORBIDDEN = true;
      return updateWebhookResult;
    }

    if (isAdmin) {
      query = { _id: webhookId };
    }

    const updated = await Webhook.updateOne(query, { url });

    updateWebhookResult.OK = updated.nModified === 1;

    if (updateWebhookResult.OK) {
      updateWebhookResult.webhook = await this.getWebhookById(webhookId);
    }
    return updateWebhookResult;
  }

  public async deleteWebhook(
    webhookId: string,
    userId: string,
    isAdmin: boolean
  ): Promise<DeleteWebhookResult> {
    let query: UpdateDeleteQuery = { _id: webhookId, userId };
    let deleteWebhookResult: DeleteWebhookResult = {
      FORBIDDEN: false,
      NOT_FOUND: false,
      OK: false,
    };

    const webhook = await Webhook.findById(webhookId);

    if (!webhook) {
      deleteWebhookResult.NOT_FOUND = true;
      return deleteWebhookResult;
    }

    if (!isAdmin && webhook.userId !== userId.toString()) {
      deleteWebhookResult.FORBIDDEN = true;
      return deleteWebhookResult;
    }

    if (isAdmin) {
      query = { _id: webhookId };
    }

    const deleted = await Webhook.deleteOne(query);
    deleteWebhookResult.OK = deleted.deletedCount === 1;

    return deleteWebhookResult;
  }

  public async webhookHandler(
    userId: string,
    event: string,
    recipe: RecipeDocument | null,
    recipeId?: string
  ): Promise<boolean> {
    const webhooks = await this.getWebhooks(userId, userId, false);
    let recipeWithEvent: RecipeWithEvent;
    if (webhooks && webhooks.length > 0) {
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
