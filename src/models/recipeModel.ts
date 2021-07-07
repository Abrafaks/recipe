import * as mongoose from "mongoose";

export interface Recipe {
  title: string;
  description: string;
  preparing: [string];
  ingredients: [[string]];
  userId: string;
  url: string;
}

const recipeSchema = new mongoose.Schema<Recipe>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  preparing: [{ type: String, required: true }],
  ingredients: [[{ type: String, required: true }]],
  userId: { type: String, required: true },
  url: { type: String, required: true },
});

export const Recipe = mongoose.model<Recipe>("recipe", recipeSchema);
