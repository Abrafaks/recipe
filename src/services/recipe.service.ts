import { Image } from "../models/image.model";
import { Recipe, RecipeDocument } from "../models/recipe.model";

type CreateRecipeBody = Omit<Recipe, "userId">;
type CreateRecipeWithoutId = Omit<Recipe, "image">;

interface DeleteRecipe {
  recipeId: string;
  userId?: string;
}
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

  public async readRecipeByUserId(
    userId: string
  ): Promise<RecipeDocument[] | null> {
    return Recipe.find({ userId });
  }

  public async updateRecipe(
    id: string,
    userId: string | null,
    { title, description, preparing, ingredients }: CreateRecipeBody
  ): Promise<RecipeDocument | null> {
    let result;
    if (!userId) {
      result = await Recipe.updateOne(
        { _id: id },
        { title, description, preparing, ingredients },
        {
          omitUndefined: true,
        }
      );
    } else {
      result = await Recipe.updateOne(
        { _id: id, userId },
        { title, description, preparing, ingredients },
        {
          omitUndefined: true,
        }
      );
    }

    if (result.nModified === 1) {
      return await Recipe.findOne({ _id: id });
    }

    return null;
  }

  public async deleteRecipeImages(recipeId: string): Promise<boolean> {
    const count = await Image.countDocuments({ recipeId });
    const deleted = await Image.deleteMany({ recipeId });
    const deletedCount = deleted?.deletedCount;
    if (count === deletedCount) {
      return true;
    }
    return false;
  }

  public async deleteRecipeById({
    recipeId,
    userId,
  }: DeleteRecipe): Promise<boolean | string> {
    let query;
    if (!userId) {
      query = { _id: recipeId };
    } else {
      query = { _id: recipeId, userId };
    }
    const result = await Recipe.deleteOne(query);

    if (result.n === 1) {
      if (await this.deleteRecipeImages(recipeId)) {
        return "Deleted recipe and it's images";
      } else {
        return "Deleted recipe and failed to delete images";
      }
    }
    return false;
  }
}

export default new RecipeService();
