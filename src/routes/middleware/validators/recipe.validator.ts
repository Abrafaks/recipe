import {
  body,
  param,
  ValidationChain,
  CustomValidator,
} from "express-validator";

const title = body("title")
  .notEmpty()
  .isString()
  .isLength({ min: 16, max: 80 });

const description = body("description")
  .notEmpty()
  .isString()
  .isLength({ min: 32, max: 256 });

const url = body("url")
  .notEmpty()
  .matches(/(\/\w+)+\.\w+/i);

const id = body("id").notEmpty().isMongoId();
const preparing = body("preparing").isArray();
const preparingContent = body(["preparing[*]"]).notEmpty().isString();
const ingredients = body(["ingredients", "ingredients[*]"]).isArray();
const ingredientsContent = body(["ingredients[*][*]"]).notEmpty().isString();

const readId = param("id").notEmpty().isMongoId();

const validateData = [
  title,
  description,
  preparing,
  preparingContent,
  ingredientsContent,
  ingredients,
  url,
];

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
}

export default new RecipeValidator();
