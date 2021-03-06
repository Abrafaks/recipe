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
      return true;
    }
    return false;
  })
  .withMessage("Title must contain at least 3 letters");

const description = body("description")
  .notEmpty()
  .withMessage("Description must not be empty")
  .isString()
  .withMessage("Description must be of type string")
  .trim()
  .isLength({ max: 256 })
  .withMessage("Description length must be max 256")
  .optional();

const id = body("id")
  .notEmpty()
  .withMessage("Id must not be empty")
  .isMongoId()
  .withMessage("Id must be valid");

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
  .notEmpty()
  .withMessage("Preparing must not be empty")
  .isString()
  .withMessage("Preparing must be of type string")
  .trim();

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
  .notEmpty()
  .withMessage("Ingredients must not be empty")
  .isString()
  .withMessage("Ingredients must be of type string")
  .trim();

const readId = param("id")
  .notEmpty()
  .withMessage("ID must not be empty")
  .isMongoId()
  .withMessage("Id must be valid");

const recipeId = param("recipeId")
  .notEmpty()
  .withMessage("ID must not be empty")
  .isMongoId()
  .withMessage("Id must be valid");

const page = query("page")
  .isInt({ min: 0, max: 1000000000 })
  .withMessage(
    "Pagination data must be positive integer, that is lower than 1000000000"
  )
  .toInt();

const pageSize = query("pageSize")
  .isInt({ min: 0, max: 100 })
  .withMessage(
    "Pagination data must be positive integer value between 0 and 100"
  )
  .toInt();

const searchTitle = query("title")
  .notEmpty()
  .withMessage("Title must not be empty")
  .isString()
  .withMessage("Title must be of type string")
  .optional()
  .trim();

const searchDescription = query("description")
  .notEmpty()
  .withMessage("Description must not be empty")
  .isString()
  .withMessage("Description must be of type string")
  .optional()
  .trim();

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

const getRecipeListData = [page, pageSize, searchTitle, searchDescription];
export class RecipeValidator {
  public validateCreateRecipeData(): ValidationChain[] {
    return validateCreateData;
  }
  public validateUpdateRecipeData(): ValidationChain[] {
    return [...validateUpdateData, readId];
  }
  public validateDeleteRecipeData(): ValidationChain {
    return recipeId;
  }
  public validateReadRecipeById(): ValidationChain {
    return readId;
  }
  public validateGetRecipeList(): ValidationChain[] {
    return getRecipeListData;
  }
  public validateReadUserRecipesById(): ValidationChain {
    return readId;
  }
}

export default new RecipeValidator();
