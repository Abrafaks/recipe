import { chai, expect, app, StatusCodes } from "./config/server.config";
import { recipe, deleteAllRecipes } from "./mocks/recipe.mocks";
import { getToken } from "./mocks/user.mocks";

let token = "Bearer ";

before("Add user and get token", async function () {
  token += await getToken();
});

after("Delete all recipes", async function () {
  await deleteAllRecipes();
});

describe("Recipe testing", function () {
  it("should return token", function () {
    expect(token).to.be.a("string");
  });
  it("should create recipe", async function () {
    const response = await chai
      .request(app)
      .post("/recipe/")
      .set("content-type", "application/json")
      .set("Authorization", token)
      .send({
        ...recipe,
      });
    expect(response).to.have.status(StatusCodes.OK);
  });
});
