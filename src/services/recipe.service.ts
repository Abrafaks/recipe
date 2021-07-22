import { Recipe, RecipeDocument } from "../models/recipe.model";

type CreateRecipeBody = Omit<Recipe, "userId">;
type CreateRecipeWithoutId = Omit<Recipe, "image">;

export class RecipeService {
  public createRecipe(recipe: Recipe): Promise<CreateRecipeWithoutId> {
    return new Recipe(recipe).save();
  }

  public async getRecipeList(
    name: string | undefined,
    skip: number,
    limit: number
  ): Promise<RecipeDocument[]> {
    let regexp = new RegExp(".*", "gmi");
    if (name) {
      regexp = new RegExp(name, "gmi");
    }
    const recipes = await Recipe.find({ title: regexp }, null, {
      skip,
      limit,
    });

    return recipes;
  }

  public async readRecipeById(id: string): Promise<RecipeDocument | null> {
    return Recipe.findById(id);
  }

  public async updateRecipe(
    id: string,
    userId: string | null,
    { title, description, preparing, ingredients }: CreateRecipeBody
  ): Promise<boolean> {
    if (!userId) {
      const result = await Recipe.updateOne(
        { _id: id },
        { title, description, preparing, ingredients }
      );

      if (result.nModified === 1) {
        return true;
      }
    } else {
      const result = await Recipe.updateOne(
        { _id: id, userId },
        { title, description, preparing, ingredients }
      );

      if (result.nModified === 1) {
        return true;
      }
    }
    return false;
  }
}

export default new RecipeService();
