import { Recipe, RecipeDocument } from "../models/recipe.model";

type CreateRecipeBody = Omit<Recipe, "userId">;

export class RecipeService {
  public createRecipe(recipe: Recipe): Promise<RecipeDocument> {
    return new Recipe(recipe).save();
  }

  public async getRecipeList(
    name: string | undefined,
    skip: number,
    limit: number
  ): Promise<RecipeDocument[]> {
    let recipes;
    if (name) {
      const regexp = new RegExp(name, "gmi");
      recipes = await Recipe.find({ title: regexp }, null, {
        skip,
        limit,
      });
    } else {
      recipes = await Recipe.find({}, null, {
        skip,
        limit,
      });
    }

    return recipes;
  }

  public async readRecipeById(id: string): Promise<RecipeDocument | null> {
    return Recipe.findById(id);
  }

  public async updateRecipe(
    id: string,
    userId: string | null,
    { title, description, preparing, ingredients, url }: CreateRecipeBody
  ): Promise<boolean> {
    if (!userId) {
      const result = await Recipe.updateOne(
        { _id: id },
        { title, description, preparing, ingredients, url }
      );

      if (result.nModified === 1) {
        return true;
      }
    } else {
      const result = await Recipe.updateOne(
        { _id: id, userId },
        { title, description, preparing, ingredients, url }
      );

      if (result.nModified === 1) {
        return true;
      }
    }
    return false;
  }
}

export default new RecipeService();
