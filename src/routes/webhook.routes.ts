import express from "express";
import webhookController from "../controllers/webhook.controller";
import { Strategy, auth } from "./middleware/auth";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - user
 *     description: Account registration
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         schema:
 *           $ref: '#components/schemas/User'
 *           required: true
 *
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/UserDocument'
 *       400:
 *         description: Account with this email already exists.
 */

router.post(
  "/",
  webhookValidator.validateUser(),
  validate,
  webhookController.addWebhook
);

export default router;
