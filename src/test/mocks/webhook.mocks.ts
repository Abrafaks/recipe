import { Webhook, WebhookDocument } from "../config/server.config";

enum Event {
  create_recipe = "create_recipe",
  update_recipe = "update_recipe",
  delete_recipe = "delete_recipe",
}

const deleteAllWebhooks = function () {
  return Webhook.deleteMany();
};

const addWebhook = async function (userId: string): Promise<WebhookDocument> {
  const webhook = await new Webhook({
    url: "https://trello.com/b/S495BUmj/recipesssss",
    userId: userId,
  }).save();
  return webhook;
};

export { deleteAllWebhooks, addWebhook, Event };
