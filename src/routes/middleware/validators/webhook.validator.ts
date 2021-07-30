import { body, ValidationChain } from "express-validator";

const url = body("url").isURL().withMessage("Invalid url");

const createWebhookData = [url];

export class WebhookValidator {
  public validateAddWebhook(): ValidationChain[] {
    return createWebhookData;
  }
}

export default new WebhookValidator();
