import { body } from "express-validator";

export class RecipeValidator {
  public validateCreateRecipeData() {
    return (
      body(["title", "description", "url"]).notEmpty(),
      body(["preparing", "ingredients", "ingredients[*]"]).notEmpty().isArray()
    );
  }
  public validateUpdateRecipeData() {
    return (
      body(["title", "description", "url", "id"]).notEmpty(),
      body(["preparing", "ingredients", "ingredients[*]"]).notEmpty().isArray()
    );
  }
}

export default new RecipeValidator();
