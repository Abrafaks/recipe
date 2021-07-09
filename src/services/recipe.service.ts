import express from "express";
import { Request, Response } from "express";
import { Recipe, RecipeDocument } from "../models/recipe.model";

type CreateRecipeBody = Omit<Recipe, "userId">;

export async function createRecipe(recipe: Recipe): Promise<RecipeDocument> {
  const newRecipe = new Recipe(recipe);
  return await newRecipe.save();
}

export async function getRecipeList(
  userId: string | null,
  name: string | null,
  skip: number,
  limit: number
): Promise<RecipeDocument[]> {
  let recipes: RecipeDocument[];
  if (!userId) {
    recipes = await Recipe.find({}, null, { skip, limit });
  } else {
    if (name === null) {
      recipes = await Recipe.find({ userId }, null, { skip, limit });
    } else {
      const regexp = new RegExp(name, "gmi");
      recipes = await Recipe.find({ title: regexp, userId }, null, {
        skip,
        limit,
      });
    }
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
