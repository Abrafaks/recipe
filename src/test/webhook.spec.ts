import {
  chai,
  expect,
  sinon,
  app,
  StatusCodes,
  RecipeDocument,
} from "./config/server.config";
import { deleteAllWebhooks, addWebhook } from "./mocks/webhook.mocks";
import { getToken, deleteAllUsers } from "./mocks/user.mocks";
import {
  addSomeRecipes,
  deleteAllRecipes,
  recipes,
} from "./mocks/recipe.mocks";
import webhookService from "../services/webhook.service";
import { assert, SinonMatcher } from "sinon";

describe("Webhook testing", function () {
  let token: string;
  let userId: string;
  let webhookId: string;

  beforeEach("Add webhook, user and get token", async function () {
    const user = await getToken();
    const webhook = await addWebhook(user.userId);

    token = "Bearer " + user.token;
    userId = user.userId;
    webhookId = webhook._id;
  });

  afterEach("Delete all webhooks and users", async function () {
    await deleteAllUsers();
    await deleteAllWebhooks();
  });

  describe("Create webhook", function () {
    it("should create webhook", async function () {
      const response = await chai
        .request(app)
        .post("/webhooks")
        .set("content-type", "application/json")
        .set("Authorization", `${token}`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipe",
        });
      expect(response.error).to.be.false;
      expect(response).to.have.status(StatusCodes.CREATED);
      expect(response.body).to.not.be.null;
    });

    it("should not create same webhook twice", async function () {
      const response1 = await chai
        .request(app)
        .post("/webhooks")
        .set("content-type", "application/json")
        .set("Authorization", `${token}`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipe",
        });

      const response2 = await chai
        .request(app)
        .post("/webhooks")
        .set("content-type", "application/json")
        .set("Authorization", `${token}`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipe",
        });
      expect(response1.error).to.be.false;
      expect(response1).to.have.status(StatusCodes.CREATED);
      expect(response1.body).to.not.be.null;

      expect(response2.error).to.not.be.false;
      expect(response2).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response2.body).to.not.be.null;
    });

    it("should not create webhook because of invalid url", async function () {
      const response = await chai
        .request(app)
        .post("/webhooks")
        .set("content-type", "application/json")
        .set("Authorization", `${token}`)
        .send({
          url: "//trello.com/b/S495BUmj/recipe",
        });
      expect(response.error).to.not.be.false;
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body).to.not.be.null;
    });
  });

  describe("Read webhook", function () {
    it("should read my webhooks", async function () {
      const response = await chai
        .request(app)
        .get(`/webhooks/${userId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${token}`)
        .send();

      expect(response).to.have.status(StatusCodes.OK);
      expect(response.error).to.be.false;
      expect(response.body).to.not.be.null;
    });

    it("should not read unauthenticated user webhooks", async function () {
      const response = await chai
        .request(app)
        .get(`/webhooks/${userId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${token}hehe`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipe",
        });

      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("Update webhook", function () {
    it("should update my webhook", async function () {
      const response = await chai
        .request(app)
        .put(`/webhooks/${webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${token}`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipe",
        });

      expect(response.error).to.be.false;
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.not.be.null;
    });

    it("should update webhook with same data", async function () {
      const response = await chai
        .request(app)
        .put(`/webhooks/${webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${token}`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipesssss",
        });

      expect(response).to.have.status(StatusCodes.OK);
    });

    it("should not update webhook for unauthenticated user", async function () {
      const response = await chai
        .request(app)
        .put(`/webhooks/${webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${token}hehe`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipesssss",
        });

      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("Delete webhook", function () {
    it("should delete my webhook", async function () {
      const response = await chai
        .request(app)
        .delete(`/webhooks/${webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${token}`);

      expect(response.error).to.be.false;
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.not.be.null;
    });

    it("should not delete webhook with invalid ID", async function () {
      const response = await chai
        .request(app)
        .delete(`/webhooks/${webhookId}hehe`)
        .set("content-type", "application/json")
        .set("Authorization", `${token}`);

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });

    it("should not delete webhook for unauthenticated user", async function () {
      const response = await chai
        .request(app)
        .delete(`/webhooks/${webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${token}hehe`);

      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
  });

  describe("Request interception", function () {
    const sandbox = sinon.createSandbox();
    let recipe: RecipeDocument;

    beforeEach(async function () {});

    afterEach(function () {
      sandbox.restore();
      deleteAllRecipes();
    });

    it("should send POST request to given address after creating recipe", async function () {
      const sendWebhookNotificationSpy = sandbox.spy(
        webhookService,
        "sendWebhookNotification"
      );
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipe,
        });

      sinon.assert.calledOnce(sendWebhookNotificationSpy);
      sinon.assert.calledWith(
        sendWebhookNotificationSpy,
        userId,
        "create_recipe",
        response.body
      );
    });

    it("should send POST request to given address after updating recipe", async function () {
      const sendWebhookNotificationSpy = sandbox.spy(
        webhookService,
        "sendWebhookNotification"
      );
      const recipe = await addSomeRecipes(userId);

      const response = await chai
        .request(app)
        .put(`/recipe/${recipe._id}`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipe,
        });

      sinon.assert.calledOnce(sendWebhookNotificationSpy);
      sinon.assert.calledWith(
        sendWebhookNotificationSpy,
        userId,
        "update_recipe",
        response.body
      );
    });

    it("should send POST request to given address after deleting recipe", async function () {
      const sendWebhookNotificationSpy = sandbox.spy(
        webhookService,
        "sendWebhookNotification"
      );
      const recipeToDelete = (await addSomeRecipes(userId))._id;

      const response = await chai
        .request(app)
        .delete(`/recipe/${recipeToDelete}`)
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send();

      response.body.__v = 0;

      sinon.assert.calledOnce(sendWebhookNotificationSpy);

      sinon.assert.calledWith(
        sendWebhookNotificationSpy,
        userId,
        "delete_recipe",
        null,
        recipeToDelete.toString()
      );
    });
  });
});
