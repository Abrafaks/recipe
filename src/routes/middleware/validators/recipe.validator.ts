import { body, ValidationChain, CustomValidator } from "express-validator";

const title = body("title")
  .notEmpty()
  .isAlphanumeric("en-US", { ignore: " " })
  .isLength({ min: 16, max: 80 })
  .optional()
  .exists();

const description = body("description")
  .notEmpty()
  .isAscii()
  .isLength({ min: 32, max: 256 });

const url = body("url")
  .notEmpty()
  .matches(/(\/\w+)+\.\w+/i);

const id = body("id").notEmpty().isMongoId();
const preparing = body("preparing").isArray();
const preparingContent = body(["preparing[*]"]).notEmpty().isAscii();
const ingredients = body(["ingredients", "ingredients[*]"]).isArray();
const ingredientsContent = body(["ingredients[*][*]"]).notEmpty().isAscii();

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
}

export default new RecipeValidator();
