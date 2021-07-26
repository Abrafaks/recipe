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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const express_validator_1 = require("express-validator");
const recipe_service_1 = __importDefault(require("../services/recipe.service"));
class RecipeController {
    constructor(recipeService) {
        this.recipeService = recipeService;
    }
    createRecipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, preparing, ingredients } = express_validator_1.matchedData(req);
                const { _id } = req.user;
                const recipeData = {
                    title,
                    description,
                    preparing,
                    ingredients,
                    userId: _id,
                };
                const savedRecipe = yield recipe_service_1.default.createRecipe(recipeData);
                return res.send(savedRecipe);
            }
            catch (err) {
                return res.status(500).send();
            }
        });
    }
    getRecipeList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, limit, name } = express_validator_1.matchedData(req);
                const recipes = yield recipe_service_1.default.getRecipeList(name, skip, limit);
                return res.json(recipes);
            }
            catch (err) {
                return res.status(500).send();
            }
        });
    }
    readRecipeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = express_validator_1.matchedData(req);
                const recipe = yield recipe_service_1.default.readRecipeById(id);
                return res.json(recipe);
            }
            catch (err) {
                return res.status(500).send();
            }
        });
    }
    updateRecipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, preparing, ingredients } = express_validator_1.matchedData(req, {
                    locations: ["body"],
                });
                const { id } = express_validator_1.matchedData(req, { locations: ["params"] });
                const { _id, isAdmin } = req.user;
                let result;
                if (isAdmin) {
                    result = yield recipe_service_1.default.updateRecipe(id, null, {
                        title,
                        description,
                        preparing,
                        ingredients,
                    });
                }
                else {
                    result = yield recipe_service_1.default.updateRecipe(id, _id, {
                        title,
                        description,
                        preparing,
                        ingredients,
                    });
                }
                if (result) {
                    return res.send();
                }
                else {
                    return res.status(400).send();
                }
            }
            catch (err) {
                return res.status(500).send();
            }
        });
    }
}
exports.RecipeController = RecipeController;
exports.default = new RecipeController(recipe_service_1.default);
