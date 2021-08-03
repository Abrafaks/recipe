import { Webhook } from "../config/server.config";

const deleteAllWebhooks = function () {
  return Webhook.deleteMany();
};

const addWebhook = async function (userId: string) {
  const webhook = await new Webhook({
    url: "https://trello.com/b/S495BUmj/recipesssss",
    userId: userId,
  }).save();
  return webhook;
};

export { deleteAllWebhooks, addWebhook };
