import { Webhook } from "../config/server.config";

const deleteAllWebhooks = function () {
  return Webhook.deleteMany();
};

const addWebhook = async function () {
  const webhook = await new Webhook({
    url: "https://trello.com/b/S495BUmj/recipesssss",
    userId: process.env.userId!,
  }).save();
  process.env.webhookId = webhook._id;
  return webhook;
};

export { deleteAllWebhooks, addWebhook };
