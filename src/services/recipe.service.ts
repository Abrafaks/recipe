import express from "express";
import { Request, Response } from "express";
import { Recipe, RecipeDocument } from "../models/recipe.model";

type CreateRecipeBody = Omit<Recipe, "userId">;

export async function createRecipe(recipe: Recipe): Promise<RecipeDocument> {
  const newRecipe = new Recipe(recipe);
  const savedRecipe = await newRecipe.save();
  return savedRecipe;
}

export async function filterRecipesByName(
  res: Response,
  name: string
): Promise<RecipeDocument[]> {
  const recipes = await Recipe.find({
    title: new RegExp("^" + name + "$", "i"),
  });

  return recipes;
}

export async function readAllRecipes(
  userId: string | null,
  skip: number,
  limit: number
): Promise<RecipeDocument[]> {
  let recipes;
  if (!userId) {
    recipes = Recipe.find({}, null, { skip, limit });
  } else {
    recipes = Recipe.find({ userId }, null, { skip, limit });
  }
  return recipes;
}

export async function readRecipeById(
  id: string
): Promise<RecipeDocument | null> {
  return await Recipe.findById(id);
}

export async function updateRecipe(
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
