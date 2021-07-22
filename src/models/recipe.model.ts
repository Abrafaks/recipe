import { Document, Schema, model } from "mongoose";

/**
 * @swagger
 * tags:
 * - name: Recipe
 *   description: "Recipe model"
 * definitions:
 *   Recipe:
 *     type: object
 *     properties:
 *       title:
 *          type: string
 *          description: Recipe title. Min 3, max 80 chars
 *          example: Chocolate cookies
 *       description:
 *          type: string
 *          description: Recipe description. Not required. Max 256 chars.
 *          example: My first recipe
 *       preparing:
 *          type: array of strings
 *          description: Recipe preparing guide. Each step is new index in array.
 *          example: ['Prepare ingredients', 'Measure flour', 'Set up the oven']
 *       ingredients:
 *          type: array of arrays of strings
 *          description: Recipe ingredients. Proposed format is [['amount measure', 'ingredient'],['amount measure', 'ingredient']]
 *          example: [['1tbs', 'salt'], ['2 cups', 'water'], ['3 cups', 'flour']]
 *       url:
 *          type: string
 *          description: Work in progress. Will be completely changed
 *          example: /must/start/with/index.js
 *     required:
 *       - title
 *       - description
 *       - preparing
 *       - ingredients
 *       - url
 *
 */
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
