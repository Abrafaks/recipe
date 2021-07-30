import { chai, expect, app, StatusCodes } from "./config/server.config";
import { deleteAllWebhooks } from "./mocks/webhook.mocks";

afterEach("Delete all users", async function () {
  await deleteAllWebhooks();
});

describe("User testing", function () {
  describe("Create webhook", function () {
    it("should create webhook", async function () {
      const response = await chai
        .request(app)
        .post("/webhooks")
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}`)
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
        .set("Authorization", `${process.env.token}`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipe",
        });

      const response2 = await chai
        .request(app)
        .post("/webhooks")
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}`)
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
        .set("Authorization", `${process.env.token}`)
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
        .get("/webhooks")
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}`)
        .send();
      expect(response.error).to.be.false;
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.not.be.null;
    });

    it("should read unauthenticated user webhooks", async function () {
      const response = await chai
        .request(app)
        .get("/webhooks")
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}hehe`)
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
        .put(`/webhooks/${process.env.webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipe",
        });

      expect(response.error).to.be.false;
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.not.be.null;
    });

    it("should not update webhook with same data", async function () {
      const response = await chai
        .request(app)
        .put(`/webhooks/${process.env.webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}`)
        .send({
          url: "https://trello.com/b/S495BUmj/recipesssss",
        });

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });

    it("should not update webhook for unauthenticated user", async function () {
      const response = await chai
        .request(app)
        .put(`/webhooks/${process.env.webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}hehe`)
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
        .delete(`/webhooks/${process.env.webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}`);

      expect(response.error).to.be.false;
      expect(response).to.have.status(StatusCodes.NO_CONTENT);
      expect(response.body).to.not.be.null;
    });

    it("should not delete webhook with invalid ID", async function () {
      const response = await chai
        .request(app)
        .delete(`/webhooks/${process.env.webhookId}hehe`)
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}`);

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });

    it("should not delete webhook for unauthenticated user", async function () {
      const response = await chai
        .request(app)
        .delete(`/webhooks/${process.env.webhookId}`)
        .set("content-type", "application/json")
        .set("Authorization", `${process.env.token}hehe`);

      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
  });
});
