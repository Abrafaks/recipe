import {
  chai,
  expect,
  app,
  StatusCodes,
  RecipeDocument,
} from "./config/server.config";
import {
  recipes,
  deleteAllRecipes,
  addSomeRecipes,
} from "./mocks/recipe.mocks";
import { getToken } from "./mocks/user.mocks";

let token = "Bearer ";
let _id: string;

before("Add user and get token", async function () {
  token += await getToken();
  _id = await addSomeRecipes();
});

after("Delete all recipes", async function () {
  await deleteAllRecipes();
});

describe("Recipe testing", function () {
  it("should return token", function () {
    expect(token).to.be.a("string");
  });

  describe("Creating recipes", function () {
    it("should create recipe", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipe,
        });
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.not.be.null;
    });

    it("should not create recipe for unauthenticated user", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token + "oszukista")
        .send({
          ...recipes.recipe,
        });
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.body).to.be.an("object").that.is.empty;
    });
  });

  describe("Recipe title validation", function () {
    it("should not create recipe with empty title", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeTitleEmpty,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Title must not be empty"
      );
    });

    it("should not create recipe with title that is not string", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeTitleNotString,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Title must be of type string"
      );
    });

    it("should not create recipe with title that is too short", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeTitleTooShort,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Title's length must be between 3 and 80"
      );
    });

    it("should not create recipe with title that is too long", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeTitleTooLong,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Title's length must be between 3 and 80"
      );
    });
  });

  describe("Recipe description testing", function () {
    it("should not create recipe with description that is too long", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeDescriptionTooLong,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Description length must be max 256"
      );
    });

    it("should create recipe without description", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeDescriptionEmpty,
        });
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.not.be.null;
    });

    it("should not create recipe with description that is not string", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeDescriptionNotString,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Description must be of type string"
      );
    });
  });

  describe("Recipe preparing testing", function () {
    it("should not create recipe with empty preparing", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipePreparingEmpty,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Preparing must not be empty"
      );
    });

    it("should not create recipe with preparing that is not array", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipePreparingNotArray,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Preparing must be array"
      );
    });

    it("should not create recipe with preparing content that is not string", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipePreparingContentNotString,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Preparing must be of type string"
      );
    });

    it("should not create recipe with preparing content that is empty", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipePreparingContentEmpty,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Preparing must not be empty"
      );
    });
  });

  describe("Recipe preparing testing", function () {
    it("should not create recipe with ingredients that is empty", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeIngredientsEmpty,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Ingredients must not be empty"
      );
    });

    it("should not create recipe with ingredients that is not array", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeIngredients1NotArray,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Ingredients must be array"
      );
    });

    it("should not create recipe with ingredients array content that is not array", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeIngredients2NotArray,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Ingredients must be array"
      );
    });

    it("should not create recipe with ingredients content that is empty", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeIngredientsContentEmpty,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Ingredients must not be empty"
      );
    });

    it("should not create recipe with ingredients content that is not string", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipeIngredientsContentNotString,
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Ingredients must be of type string"
      );
    });
  });

  describe("Reading recipes", function () {
    it("should return all recipes", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token);

      expect(response).to.have.status(StatusCodes.OK);

      response.body.forEach(function (element: RecipeDocument) {
        expect(element).to.include.keys([
          "_id",
          "title",
          "preparing",
          "ingredients",
          "url",
          "userId",
          "__v",
        ]);
      });
    });

    it("should not return all recipes for unauthenticated user", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token + "cheater");

      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it("should return two recipes (testing limit)", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ skip: 2, limit: 2 });

      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.length).to.equal(2);
    });

    it("should return no recipes (testing skip)", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ skip: 4 });

      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.length).to.equal(0);
    });

    it("should return recipe by valid name", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ name: recipes.recipe.title });

      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body[0].title).to.be.equal(recipes.recipe.title);
      expect(response.body.length).to.be.equal(2);
    });

    it("should not return recipe by invalid name (no such title with this name)", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ name: "some recipe title with this long name" });

      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.length).to.be.equal(0);
    });

    it("should not return recipe by invalid name (not string)", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ name: { name: "some recipe title with this long name" } });

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Name must be of type string"
      );
    });

    it("should not return recipe by invalid name (empty)", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ name: "" });

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Name must not be empty"
      );
    });
  });
  describe("Read recipe by id", function () {
    it("should return recipe by id", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/" + _id)
        .set("Authorization", token);
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.include.keys([
        "_id",
        "title",
        "preparing",
        "ingredients",
        "url",
        "userId",
        "__v",
      ]);
    });

    it("should not return recipe, because id is invalid", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/" + _id + "invalid")
        .set("Authorization", token);
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Id must be valid mongodb id"
      );
    });

    it("should not return recipe for unauthenticated user", async function () {
      const response = await chai.request(app).get("/recipe/" + _id);
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.text).to.have.string("Unauthorized");
    });
  });
});
