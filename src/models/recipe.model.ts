import { Document, Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Recipe title. Min 3, max 80 chars
 *           example: Chocolate cookies
 *         description:
 *           type: string
 *           description: Recipe description. Not required. Max 256 chars.
 *           example: My first recipe
 *         preparing:
 *           type: array of strings
 *           description: Recipe preparing guide. Each step is new index in array.
 *           example: ['Prepare ingredients', 'Measure flour', 'Set up the oven']
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *             items:
 *               type: string
 *           description:  |
 *             Recipe ingredients. Proposed format is [['amount measure', 'ingredient'], ['amount measure', 'ingredient']]
 *             but it is allowed to have only one item in nested array in case where amount and measure are not needed.
 *           example: [['1tbs', 'salt'], ['2 cups', 'water'], ['3 cups', 'flour']]
 *       required:
 *         - title
 *         - preparing
 *         - ingredients
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeDocument:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Recipe title. Min 3, max 80 chars
 *           example: Chocolate cookies
 *         description:
 *           type: string
 *           description: Recipe description. Max 256 chars.
 *           example: My first recipe
 *         preparing:
 *           type: array of strings
 *           description: Recipe preparing guide. Each step is new index in array.
 *           example: ['Prepare ingredients', 'Measure flour', 'Set up the oven']
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *             items:
 *               type: string
 *           description:  |
 *             Recipe ingredients. Proposed format is [['amount measure', 'ingredient'], ['amount measure', 'ingredient']]
 *             but it is allowed to have only one item in nested array in case where amount and measure are not needed.
 *           example: [['1tbs', 'salt'], ['2 cups', 'water'], ['3 cups', 'flour']]
 *         _id:
 *           type: string
 *           description: Recipe MongoDB id
 *           example: 60f7ea20cf60ae0004307aa2
 *         userId:
 *           type: string
 *           description: MongoDB id of user who created recipe
 *           example: 60f7e9b8cf60ae0004307aa1
 *       required:
 *         - title
 *         - userId
 *         - _id
 *         - preparing
 *         - ingredients
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeQuery:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Recipe title. Min 3, max 80 chars
 *           example: Chocolate cookies
 *         description:
 *           type: string
 *           description: Recipe description. Max 256 chars.
 *           example: My first recipe
 *         preparing:
 *           type: array of strings
 *           description: Recipe preparing guide. Each step is new index in array.
 *           example: ['Prepare ingredients', 'Measure flour', 'Set up the oven']
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *             items:
 *               type: string
 *           description:  |
 *             Recipe ingredients. Proposed format is [['amount measure', 'ingredient'], ['amount measure', 'ingredient']]
 *             but it is allowed to have only one item in nested array in case where amount and measure are not needed.
 *           example: [['1tbs', 'salt'], ['2 cups', 'water'], ['3 cups', 'flour']]
 *         _id:
 *           type: string
 *           description: Recipe MongoDB id
 *           example: 60f7ea20cf60ae0004307aa2
 *         userId:
 *           type: string
 *           description: MongoDB id of user who created recipe
 *           example: 60f7e9b8cf60ae0004307aa1
 *         page:
 *           type: number
 *           description: Number of page to display (you sent this data)
 *           example: 20
 *         pageSize:
 *           type: number
 *           description: Number of recipes to display per page (you sent this data)
 *           example: 20
 *         totalPages:
 *           type: number
 *           description: How many pages are for this query
 *           example: 5
 *         firstPage:
 *           type: boolean
 *           description: Is this the first page?
 *           example: false
 *         lastPage:
 *           type: boolean
 *           description: Is this the last page?
 *           example: false
 *         totalElements:
 *           type: number
 *           description: Total number of recipe for this query in database
 *           example: 126
 *         count:
 *           type: number
 *           description: Number of recipes currently displayed
 *           example: 19
 *
 */

export interface Recipe {
  title: string;
  description: string;
  preparing: [string];
  ingredients: [[string]];
  userId: string;
}
export interface RecipeDocument extends Recipe, Document {}

const recipeSchema = new Schema<Recipe>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  preparing: [{ type: String, required: true }],
  ingredients: [[{ type: String, required: true }]],
  userId: { type: String, required: true },
});

recipeSchema.methods.toJSON = function () {
  const recipe = this;
  const recipeObject = recipe.toObject();

  delete recipeObject.__v;

  return { ...recipeObject, _id: recipeObject._id.toString() };
};

export const Recipe = model<RecipeDocument>("recipe", recipeSchema);
