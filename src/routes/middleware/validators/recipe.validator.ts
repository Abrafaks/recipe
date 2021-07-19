import { body, param, ValidationChain, query } from "express-validator";

const title = body("title").notEmpty().isString().isLength({ min: 3, max: 80 });

const description = body("description")
  .notEmpty()
  .isString()
  .isLength({ max: 256 })
  .optional();

const url = body("url")
  .notEmpty()
  .matches(/^(\/\w+)+\.\w+$/i);

const id = body("id").notEmpty().isMongoId();
const preparing = body("preparing").isArray();
const preparingContent = body(["preparing[*]"]).notEmpty().isString();
const ingredients = body(["ingredients", "ingredients[*]"]).isArray();
const ingredientsContent = body(["ingredients[*][*]"]).notEmpty().isString();

const readId = param("id").notEmpty().isMongoId();

const paginationData = query(["skip", "limit"])
  .isInt({ min: 0 })
  .toInt()
  .optional();
const searchName = query("name").notEmpty().isString().optional();

const validateData = [
  title,
  description,
  preparing,
  preparingContent,
  ingredientsContent,
  ingredients,
  url,
];

const getRecipeListData = [paginationData, searchName];

export class RecipeValidator {
  public validateCreateRecipeData(): ValidationChain[] {
    return validateData;
  }
  public validateUpdateRecipeData(): ValidationChain[] {
    return [...validateData, id];
  }
  public validateReadRecipeById(): ValidationChain {
    return readId;
  }
  public validateGetRecipeList(): ValidationChain[] {
    return getRecipeListData;
  }
}

export default new RecipeValidator();
