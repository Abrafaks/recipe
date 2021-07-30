import { body, param, ValidationChain } from "express-validator";

const url = body("url").isURL().withMessage("Invalid url");

const webhookId = param("webhookId").isMongoId().withMessage("Invalid id");

const createWebhookData = [url];

const updateWebhookData = [url, webhookId];

export class WebhookValidator {
  public validateAddWebhook(): ValidationChain[] {
    return createWebhookData;
  }

  public validateUpdateWebhook(): ValidationChain[] {
    return updateWebhookData;
  }
}

export default new WebhookValidator();
