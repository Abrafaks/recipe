import { body, param, ValidationChain, query } from "express-validator";

const updateTitle = body("title")
  .notEmpty()
  .withMessage("Title must not be empty")
  .isString()
  .withMessage("Title must be of type string")
  .isLength({ min: 3, max: 80 })
  .withMessage("Title's length must be between 3 and 80")
  .custom((value, { req }) => {
    if (value.match(/[a-zA-Z]/g).length > 2) {
      console.log(value.match(/[a-zA-Z]/g));
      return true;
    }
    return false;
  })
  .withMessage("Title must contain at least 3 letters")
  .optional();

const createTitle = body("title")
  .notEmpty()
  .withMessage("Title must not be empty")
  .isString()
  .withMessage("Title must be of type string")
  .isLength({ min: 3, max: 80 })
  .withMessage("Title's length must be between 3 and 80")
  .custom((value, { req }) => {
    if (value.match(/[a-zA-Z]/g).length > 2) {
      console.log(value.match(/[a-zA-Z]/g));
      return true;
    }
    return false;
  })
  .withMessage("Title must contain at least 3 letters");

const description = body("description")
  .trim()
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

const updatePreparing = body("preparing")
  .notEmpty()
  .withMessage("Preparing must not be empty")
  .isArray()
  .withMessage("Preparing must be array")
  .optional();

const createPreparing = body("preparing")
  .notEmpty()
  .withMessage("Preparing must not be empty")
  .isArray()
  .withMessage("Preparing must be array");

const preparingContent = body(["preparing[*]"])
  .trim()
  .notEmpty()
  .withMessage("Preparing must not be empty")
  .isString()
  .withMessage("Preparing must be of type string");

const createIngredients = body(["ingredients", "ingredients[*]"])
  .notEmpty()
  .withMessage("Ingredients must not be empty")
  .isArray()
  .withMessage("Ingredients must be array");

const updateIngredients = body(["ingredients", "ingredients[*]"])
  .notEmpty()
  .withMessage("Ingredients must not be empty")
  .isArray()
  .withMessage("Ingredients must be array")
  .optional();

const ingredientsContent = body(["ingredients[*][*]"])
  .trim()
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
  .trim()
  .notEmpty()
  .withMessage("Name must not be empty")
  .isString()
  .withMessage("Name must be of type string")
  .optional();

const validateCreateData = [
  createTitle,
  description,
  createPreparing,
  preparingContent,
  ingredientsContent,
  createIngredients,
];

const validateUpdateData = [
  updateTitle,
  description,
  updatePreparing,
  preparingContent.optional(),
  ingredientsContent.optional(),
  updateIngredients,
];

const getRecipeListData = [paginationData, searchName];

export class RecipeValidator {
  public validateCreateRecipeData(): ValidationChain[] {
    return validateCreateData;
  }
  public validateUpdateRecipeData(): ValidationChain[] {
    return [...validateUpdateData, readId];
  }
  public validateReadRecipeById(): ValidationChain {
    return readId;
  }
  public validateGetRecipeList(): ValidationChain[] {
    return getRecipeListData;
  }
}

export default new RecipeValidator();
