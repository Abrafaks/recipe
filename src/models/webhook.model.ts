import { Document, Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Webhook:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Url specifying where to send request
 *           example: https://webhook.site/#!/d09b19ef-df5c-4bbf-8dc9-852128733fb2/5d5efc9e-df18-44e6-870f-891c0bb1f99b
 *         event:
 *           type: string
 *           description: Event type
 *           example: CREATE_RECIPE
 *       required:
 *         - url
 *         - event
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WebhookDocument:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Url specifying where to send request
 *           example: https://webhook.site/#!/d09b19ef-df5c-4bbf-8dc9-852128733fb2/5d5efc9e-df18-44e6-870f-891c0bb1f99b
 *         event:
 *           type: string
 *           description: Event type
 *           example: CREATE_RECIPE
 *         userId:
 *           type: string
 *           description: Id of user that webhook belongs to
 *           example: 60f7e9b8cf60ae0004307aa1
 *         _id:
 *           type: string
 *           description: Webhook MongoDb id
 *           example: 60f7e9b8cf60ae0004307aa1
 */

export interface Webhook {
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  isDeleted: boolean;
}

export interface WebhookDocument extends Webhook, Document {}

const webhookSchema = new Schema<Webhook>({
  url: { type: String, required: true },
  userId: { type: String, required: true },
  event: { type: String, required: true },
});

webhookSchema.methods.toJSON = function () {
  const webhook = this;
  const webhookObject = webhook.toObject();

  delete webhookObject.__v;

  return webhookObject;
};

export const Webhook = model<WebhookDocument>("webhook", webhookSchema);
