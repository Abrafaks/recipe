import express from "express";
import { Request, Response } from "express";
import { Recipe } from "../models/recipe.model";

type CreateRecipeBody = Omit<Recipe, "userId">;

export async function filterRecipesByName(
  res: Response,
  name: string
): Promise<(Recipe | null)[]> {
  const recipes = await Recipe.find({
    title: new RegExp("^" + name + "$", "i"),
  });

  // Ask for declaration of array of objects | null
  return recipes;
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
