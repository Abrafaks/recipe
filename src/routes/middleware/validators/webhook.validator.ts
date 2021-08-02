import { body, param, ValidationChain } from "express-validator";

const url = body("url").isURL().withMessage("Invalid url");

const webhookId = param("webhookId").isMongoId().withMessage("Invalid id");

const userId = param("userId").isMongoId().withMessage("Invalid id");

const createWebhookData = [url];

const readWebhooksData = [userId];

const updateWebhookData = [url, webhookId];

const deleteWebhookData = [webhookId];

export class WebhookValidator {
  public validateAddWebhook(): ValidationChain[] {
    return createWebhookData;
  }

  public validateReadWebhooks(): ValidationChain[] {
    return readWebhooksData;
  }

  public validateUpdateWebhook(): ValidationChain[] {
    return updateWebhookData;
  }

  public validateDeleteWebhook(): ValidationChain[] {
    return deleteWebhookData;
  }
}

export default new WebhookValidator();
