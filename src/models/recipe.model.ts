import { Document, Schema, model } from "mongoose";

export interface Recipe {
  title: string;
  description: string;
  preparing: [string];
  ingredients: [[string]];
  userId: string;
  url: string;
}
export interface RecipeDocument extends Recipe, Document {}

const recipeSchema = new Schema<Recipe>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  preparing: [{ type: String, required: true }],
  ingredients: [[{ type: String, required: true }]],
  userId: { type: String, required: true },
  url: { type: String, required: true },
});

export const Recipe = model<RecipeDocument>("recipe", recipeSchema);
