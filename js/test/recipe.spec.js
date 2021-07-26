"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_config_1 = require("./config/server.config");
const recipe_mocks_1 = require("./mocks/recipe.mocks");
const user_mocks_1 = require("./mocks/user.mocks");
let token = "";
let _id;
let updateRecipeId;
beforeEach("Add user and get token", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield user_mocks_1.getToken();
        token = "Bearer " + data.token;
        const userId = data.userId;
        _id = yield recipe_mocks_1.addSomeRecipes(userId);
        yield recipe_mocks_1.addSomeRecipes(userId);
    });
});
afterEach("Delete all recipes", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield recipe_mocks_1.deleteAllRecipes();
        yield user_mocks_1.deleteAllUsers();
    });
});
describe("Recipe testing", function () {
    it("should return token", function () {
        server_config_1.expect(token).to.be.a("string");
    });
    describe("Creating recipes", function () {
        it("should create recipe", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipe));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body).to.not.be.null;
                server_config_1.expect(response.body).to.include.keys([
                    "_id",
                    "title",
                    "preparing",
                    "ingredients",
                    "image",
                    "userId",
                    "__v",
                ]);
                updateRecipeId = response.body._id;
            });
        });
        it("should not create recipe for unauthenticated user", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token + "oszukista")
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipe));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.UNAUTHORIZED);
                server_config_1.expect(response.body).to.be.an("object").that.is.empty;
            });
        });
    });
    describe("Recipe title validation", function () {
        it("should not create recipe with empty title", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeTitleEmpty));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Title must not be empty");
            });
        });
        it("should not create recipe with title that is not string", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeTitleNotString));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Title must be of type string");
            });
        });
        it("should not create recipe with title that is too short", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeTitleTooShort));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Title's length must be between 3 and 80");
            });
        });
        it("should not create recipe with title that is too long", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeTitleTooLong));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Title's length must be between 3 and 80");
            });
        });
    });
    describe("Recipe description testing", function () {
        it("should not create recipe with description that is too long", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeDescriptionTooLong));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Description length must be max 256");
            });
        });
        it("should create recipe without description", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeDescriptionEmpty));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body).to.not.be.null;
            });
        });
        it("should not create recipe with description that is not string", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeDescriptionNotString));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Description must be of type string");
            });
        });
    });
    describe("Recipe preparing testing", function () {
        it("should not create recipe with empty preparing", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipePreparingEmpty));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Preparing must not be empty");
            });
        });
        it("should not create recipe with preparing that is not array", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipePreparingNotArray));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Preparing must be array");
            });
        });
        it("should not create recipe with preparing content that is not string", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipePreparingContentNotString));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Preparing must be of type string");
            });
        });
        it("should not create recipe with preparing content that is empty", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipePreparingContentEmpty));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Preparing must not be empty");
            });
        });
    });
    describe("Recipe preparing testing", function () {
        it("should not create recipe with ingredients that is empty", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeIngredientsEmpty));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Ingredients must not be empty");
            });
        });
        it("should not create recipe with ingredients that is not array", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeIngredients1NotArray));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Ingredients must be array");
            });
        });
        it("should not create recipe with ingredients array content that is not array", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeIngredients2NotArray));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Ingredients must be array");
            });
        });
        it("should not create recipe with ingredients content that is empty", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeIngredientsContentEmpty));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Ingredients must not be empty");
            });
        });
        it("should not create recipe with ingredients content that is not string", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/recipe/")
                    .set("content-type", "application/json")
                    .set("Authorization", token)
                    .send(Object.assign({}, recipe_mocks_1.recipes.recipeIngredientsContentNotString));
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Ingredients must be of type string");
            });
        });
    });
    describe("Reading recipes", function () {
        it("should return all recipes", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/")
                    .set("Authorization", token);
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                response.body.forEach(function (element) {
                    server_config_1.expect(element).to.include.keys([
                        "_id",
                        "title",
                        "preparing",
                        "ingredients",
                        "image",
                        "userId",
                        "__v",
                    ]);
                });
            });
        });
        it("should not return all recipes for unauthenticated user", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/")
                    .set("Authorization", token + "cheater");
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.UNAUTHORIZED);
            });
        });
        it("should return one recipes (testing limit)", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/")
                    .set("Authorization", token)
                    .query({ skip: 2, limit: 2 });
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body.length).to.equal(2);
            });
        });
        it("should return no recipes (testing skip)", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/")
                    .set("Authorization", token)
                    .query({ skip: 4 });
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body.length).to.equal(0);
            });
        });
        it("should return recipe by valid name", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/")
                    .set("Authorization", token)
                    .query({ name: recipe_mocks_1.recipes.recipe.title });
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body[0].title).to.be.equal(recipe_mocks_1.recipes.recipe.title);
                server_config_1.expect(response.body.length).to.be.equal(2);
            });
        });
        it("should not return recipe by invalid name (no such title with this name)", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/")
                    .set("Authorization", token)
                    .query({ name: "some recipe title with this long name" });
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body.length).to.be.equal(0);
            });
        });
        it("should not return recipe by invalid name (not string)", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/")
                    .set("Authorization", token)
                    .query({ name: { name: "some recipe title with this long name" } });
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Name must be of type string");
            });
        });
        it("should not return recipe by invalid name (empty)", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/")
                    .set("Authorization", token)
                    .query({ name: "" });
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Name must not be empty");
            });
        });
    });
    describe("Read recipe by id", function () {
        it("should return recipe by id", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/" + _id)
                    .set("Authorization", token);
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body).to.include.keys([
                    "_id",
                    "title",
                    "preparing",
                    "ingredients",
                    "image",
                    "userId",
                    "__v",
                ]);
            });
        });
        it("should not return recipe, because id is invalid", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .get("/recipe/" + _id + "invalid")
                    .set("Authorization", token);
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
                server_config_1.expect(response.body.errors[0].msg).to.have.string("Id must be valid mongodb id");
            });
        });
        it("should not return recipe for unauthenticated user", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai.request(server_config_1.app).get("/recipe/" + _id);
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.UNAUTHORIZED);
                server_config_1.expect(response.text).to.have.string("Unauthorized");
            });
        });
    });
    describe("Update recipe testing", function () {
        it("should edit recipe for user", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const { description, preparing, ingredients, image } = recipe_mocks_1.recipes.recipe;
                const title = "New title.";
                const recipeForUpdate = yield server_config_1.Recipe.findOne({ description });
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .put("/recipe/")
                    .set("Authorization", token)
                    .send({
                    title,
                    description,
                    preparing,
                    ingredients,
                    image,
                    id: recipeForUpdate._id,
                });
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
            });
        });
        it("should not edit recipe for unauthenticated user", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const { description, preparing, ingredients, image } = recipe_mocks_1.recipes.recipe;
                const title = "New title.";
                const response = yield server_config_1.chai.request(server_config_1.app).put("/recipe/").send({
                    title,
                    description,
                    preparing,
                    ingredients,
                    image,
                    id: updateRecipeId,
                });
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.UNAUTHORIZED);
                server_config_1.expect(response.text).to.have.string("Unauthorized");
            });
        });
    });
});
