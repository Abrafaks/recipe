import { chai, expect, app, StatusCodes, Recipe } from "./config/server.config";
import {
  recipes,
  deleteAllRecipes,
  addSomeRecipes,
} from "./mocks/recipe.mocks";
import { getToken, deleteAllUsers } from "./mocks/user.mocks";

let _id: string;
let updateRecipeId: string;
let token: string;

describe("Recipe testing", function () {
  beforeEach("Add user and get token", async function () {
    const data = await getToken();

    token = "Bearer " + data.token;
    const userId = data.userId;
    _id = (await addSomeRecipes(userId))._id;
    await addSomeRecipes(userId);
  });

  afterEach("Delete all recipes", async function () {
    await deleteAllRecipes();
    await deleteAllUsers();
  });

  it("should return token", function () {
    expect(token).to.be.a("string");
  });

  context("Creating recipes", function () {
    it("should create recipe", async function () {
      const response = await chai
        .request(app)
        .post("/recipe/")
        .set("content-type", "application/json")
        .set("Authorization", token)
        .send({
          ...recipes.recipe,
        });
      expect(response).to.have.status(StatusCodes.CREATED);
      expect(response.body).to.not.be.null;
      expect(response.body).to.include.keys([
        "_id",
        "title",
        "description",
        "preparing",
        "ingredients",
        "userId",
      ]);
      updateRecipeId = response.body._id;
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

  context("Recipe title validation", function () {
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

  context("Recipe description testing", function () {
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
      expect(response).to.have.status(StatusCodes.CREATED);
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

  context("Recipe preparing testing", function () {
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

  context("Recipe preparing testing", function () {
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

  context("Reading recipes", function () {
    it("should return all recipes", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ page: 0, pageSize: 15 });

      expect(response).to.have.status(StatusCodes.OK);
      expect(response).to.be.an("object");
    });

    it("should not return all recipes for unauthenticated user", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token + "cheater");

      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it("should return recipe by valid title", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ page: 0, pageSize: 15, title: recipes.recipe.title });

      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.recipes[0].title).to.be.equal(recipes.recipe.title);
    });

    it("should not return recipe by invalid title (no such title with this title)", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({
          page: 0,
          pageSize: 15,
          title: "some recipe title with this long name",
        });

      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.recipes.length).to.be.equal(0);
    });

    it("should not return recipe by invalid title (not string)", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({
          page: 0,
          pageSize: 15,
          title: { name: "some recipe title with this long name" },
        });

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Title must be of type string"
      );
    });

    it("should not return recipe by invalid title (empty)", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/")
        .set("Authorization", token)
        .query({ page: 0, pageSize: 15, title: "" });

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string(
        "Title must not be empty"
      );
    });
  });
  context("Read recipe by id", function () {
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
        "userId",
      ]);
    });

    it("should not return recipe, because id is invalid", async function () {
      const response = await chai
        .request(app)
        .get("/recipe/" + _id + "invalid")
        .set("Authorization", token);
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).to.have.string("Id must be valid");
    });

    it("should not return recipe for unauthenticated user", async function () {
      const response = await chai.request(app).get("/recipe/" + _id);
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.text).to.have.string("Unauthorized");
    });
  });

  context("Update recipe testing", function () {
    it("should edit recipe for user", async function () {
      const { description, preparing, ingredients } = recipes.recipe;
      const title = "New title.";
      const recipeForUpdate = await Recipe.findOne({ description });

      const response = await chai
        .request(app)
        .put(`/recipe/${recipeForUpdate!._id}`)
        .set("Authorization", token)
        .send({
          title,
          description,
          preparing,
          ingredients,
        });

      expect(response).to.have.status(StatusCodes.OK);
    });

    it("should not edit recipe for unauthenticated user", async function () {
      const { description, preparing, ingredients } = recipes.recipe;
      const title = "New title.";
      const response = await chai
        .request(app)
        .put(`/recipe/${updateRecipeId}`)
        .send({
          title,
          description,
          preparing,
          ingredients,
          id: updateRecipeId,
        });
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.text).to.have.string("Unauthorized");
    });
  });
});
