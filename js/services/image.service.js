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
exports.ImageService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const image_model_1 = require("../models/image.model");
const recipe_model_1 = require("../models/recipe.model");
const rounds = 10;
class ImageService {
    readRecipeById(id, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                _id: id,
                userId,
            };
            if (isAdmin) {
                delete query.userId;
            }
            return recipe_model_1.Recipe.findOne(query);
        });
    }
    addRecipeImage(id, image, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipe = yield this.readRecipeById(id, userId, isAdmin);
            if (!recipe) {
                return null;
            }
            return new image_model_1.Image({
                recipeId: recipe._id,
                image,
            }).save();
        });
    }
    readRecipeImages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return image_model_1.Image.find({ recipeId: id });
        });
    }
    deleteImageById(imageId, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield image_model_1.Image.findOne({ _id: imageId });
            if (!image) {
                return null;
            }
            const recipe = yield this.readRecipeById(image.recipeId, userId, isAdmin);
            if (!recipe) {
                return null;
            }
            return image_model_1.Image.findOneAndDelete({ _id: imageId });
        });
    }
}
exports.ImageService = ImageService;
exports.default = new ImageService();
