import { body, param, ValidationChain, query } from "express-validator";

const title = body("title")
  .notEmpty()
  .withMessage("Title must not be empty")
  .isString()
  .withMessage("Title must be of type string")
  .isLength({ min: 3, max: 80 })
  .withMessage("Title's length must be between 3 and 80");

const description = body("description")
  .notEmpty()
  .withMessage("Description must not be empty")
  .isString()
  .withMessage("Description must be of type string")
  .isLength({ max: 256 })
  .withMessage("Description length must be max 256")
  .optional();

const id = body("id")
  .notEmpty()
  .withMessage("Id must not be empty")
  .isMongoId()
  .withMessage("Id must be valid mongodb id");

const preparing = body("preparing")
  .notEmpty()
  .withMessage("Preparing must not be empty")
  .isArray()
  .withMessage("Preparing must be array");

const preparingContent = body(["preparing[*]"])
  .notEmpty()
  .withMessage("Preparing must not be empty")
  .isString()
  .withMessage("Preparing must be of type string");

const ingredients = body(["ingredients", "ingredients[*]"])
  .notEmpty()
  .withMessage("Ingredients must not be empty")
  .isArray()
  .withMessage("Ingredients must be array");

const ingredientsContent = body(["ingredients[*][*]"])
  .notEmpty()
  .withMessage("Ingredients must not be empty")
  .isString()
  .withMessage("Ingredients must be of type string");

const readId = param("id")
  .notEmpty()
  .withMessage("ID must not be empty")
  .isMongoId()
  .withMessage("Id must be valid mongodb id");

const paginationData = query(["skip", "limit"])
  .isInt({ min: 0 })
  .withMessage("Pagination data must be positive integer")
  .toInt()
  .optional();

const searchName = query("name")
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

const getRecipeListData = [paginationData, searchName];

export class RecipeValidator {
  public validateCreateRecipeData(): ValidationChain[] {
    return validateData;
  }
  public validateUpdateRecipeData(): ValidationChain[] {
    return [...validateData, readId];
  }
  public validateReadRecipeById(): ValidationChain {
    return readId;
  }
  public validateGetRecipeList(): ValidationChain[] {
    return getRecipeListData;
  }
}

export default new RecipeValidator();
