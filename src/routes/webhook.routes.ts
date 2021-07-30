import express from "express";
import webhookController from "../controllers/webhook.controller";
import { Strategy, auth } from "./middleware/auth";
import webhookValidator from "./middleware/validators/webhook.validator";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

/**
 * @swagger
 * /webhooks/:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - webhooks
 *     description: Adding user's webhook
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: webhook
 *         schema:
 *           $ref: '#components/schemas/Webhook'
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Webhook created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/WebhookDocument'
 *       400:
 *         description: Webhook with this url exists for this user.
 *       401:
 *         description: Unauthorized.
 *
 *
 */

router.post(
  "/",
  auth.authenticate([Strategy.Bearer]),
  webhookValidator.validateAddWebhook(),
  validate,
  webhookController.addWebhook
);

/**
 * @swagger
 * /webhooks/:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - webhooks
 *     description: Reading user's webhook
 *
 *     responses:
 *       200:
 *         description: Webhooks found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/WebhookDocument'
 *       401:
 *         description: Unauthorized.
 */

router.get(
  "/",
  auth.authenticate([Strategy.Bearer]),
  webhookController.readWebhooks
);

export default router;
