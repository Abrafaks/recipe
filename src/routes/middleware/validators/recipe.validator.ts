import { body, ValidationChain } from "express-validator";

const title = body("title").notEmpty();
const description = body("description").notEmpty();
const url = body("url").notEmpty();
const id = body("id").notEmpty();
const preparing = body("preparing").isArray();
const ingredients = body(["ingredients", "ingredients[*]"]).isArray();

const validateData = [title, description, preparing, ingredients, url];

export class RecipeValidator {
  public validateCreateRecipeData(): ValidationChain[] {
    return validateData;
  }
  public validateUpdateRecipeData(): ValidationChain[] {
    return [...validateData, id];
  }
}

export default new RecipeValidator();
