import { Response } from "express";
import { User } from "src/models/user.model";
import { user } from "src/test/mocks/user.mocks";
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

  public async deleteRecipeById({
    recipeId,
    userId,
  }: DeleteRecipe): Promise<boolean> {
    let query;
    if (!userId) {
      query = { _id: recipeId };
    } else {
      query = { _id: recipeId, userId };
    }
    const result = await Recipe.deleteOne(query);

    if (result.n === 1) {
      return true;
    }
    return true;
  }
}

export default new RecipeService();
