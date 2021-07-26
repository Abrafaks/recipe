"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeValidator = void 0;
const express_validator_1 = require("express-validator");
const title = express_validator_1.body("title")
    .notEmpty()
    .withMessage("Title must not be empty")
    .isString()
    .withMessage("Title must be of type string")
    .isLength({ min: 3, max: 80 })
    .withMessage("Title's length must be between 3 and 80");
const description = express_validator_1.body("description")
    .notEmpty()
    .withMessage("Description must not be empty")
    .isString()
    .withMessage("Description must be of type string")
    .isLength({ max: 256 })
    .withMessage("Description length must be max 256")
    .optional();
const id = express_validator_1.body("id")
    .notEmpty()
    .withMessage("Id must not be empty")
    .isMongoId()
    .withMessage("Id must be valid mongodb id");
const preparing = express_validator_1.body("preparing")
    .notEmpty()
    .withMessage("Preparing must not be empty")
    .isArray()
    .withMessage("Preparing must be array");
const preparingContent = express_validator_1.body(["preparing[*]"])
    .notEmpty()
    .withMessage("Preparing must not be empty")
    .isString()
    .withMessage("Preparing must be of type string");
const ingredients = express_validator_1.body(["ingredients", "ingredients[*]"])
    .notEmpty()
    .withMessage("Ingredients must not be empty")
    .isArray()
    .withMessage("Ingredients must be array");
const ingredientsContent = express_validator_1.body(["ingredients[*][*]"])
    .notEmpty()
    .withMessage("Ingredients must not be empty")
    .isString()
    .withMessage("Ingredients must be of type string");
const readId = express_validator_1.param("id")
    .notEmpty()
    .withMessage("ID must not be empty")
    .isMongoId()
    .withMessage("Id must be valid mongodb id");
const paginationData = express_validator_1.query(["skip", "limit"])
    .isInt({ min: 0 })
    .withMessage("Pagination data must be positive integer")
    .toInt()
    .optional();
const searchName = express_validator_1.query("name")
    .notEmpty()
    .withMessage("Name must not be empty")
    .isString()
    .withMessage("Name must be of type string")
    .optional();
const validateData = [
    title,
    description,
    preparing,
    preparingContent,
    ingredientsContent,
    ingredients,
];
const validateDataForUpdate = [
    title.optional(),
    description,
    preparing.optional(),
    preparingContent.optional(),
    ingredientsContent.optional(),
    ingredients.optional(),
];
const getRecipeListData = [paginationData, searchName];
class RecipeValidator {
    validateCreateRecipeData() {
        return validateData;
    }
    validateUpdateRecipeData() {
        return [...validateDataForUpdate, readId];
    }
    validateReadRecipeById() {
        return readId;
    }
    validateGetRecipeList() {
        return getRecipeListData;
    }
}
exports.RecipeValidator = RecipeValidator;
exports.default = new RecipeValidator();
