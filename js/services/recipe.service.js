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
exports.RecipeService = void 0;
const recipe_model_1 = require("../models/recipe.model");
class RecipeService {
    createRecipe(recipe) {
        return new recipe_model_1.Recipe(recipe).save();
    }
    getRecipeList(name, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            let regexp = new RegExp(".*", "gmi");
            if (name) {
                regexp = new RegExp(name, "gmi");
            }
            const recipes = yield recipe_model_1.Recipe.find({ title: regexp }, null, {
                skip,
                limit,
            });
            return recipes;
        });
    }
    readRecipeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return recipe_model_1.Recipe.findById(id);
        });
    }
    updateRecipe(id, userId, { title, description, preparing, ingredients }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                const result = yield recipe_model_1.Recipe.updateOne({ _id: id }, { title, description, preparing, ingredients }, {
                    omitUndefined: true,
                });
                if (result.nModified === 1) {
                    return true;
                }
            }
            else {
                const result = yield recipe_model_1.Recipe.updateOne({ _id: id, userId }, { title, description, preparing, ingredients }, {
                    omitUndefined: true,
                });
                if (result.nModified === 1) {
                    return true;
                }
            }
            return false;
        });
    }
}
exports.RecipeService = RecipeService;
exports.default = new RecipeService();
