import express from "express";
import recipeController from "../controllers/recipe.controller";
import { Strategy, auth } from "./middleware/auth";
import recipeValidator from "./middleware/validators/recipe.validator";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

/**
 * @swagger
 * /recipe/:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - createRecipe
 *     description: Recipe creation
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: recipe
 *         schema:
 *           $ref: '#components/schemas/Recipe'
 *
 *     responses:
 *       200:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       401:
 *         description: Unauthorized
 */

router.post(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateCreateRecipeData(),
  validate,
  recipeController.createRecipe
);

/**
 * @swagger
 * /recipe/:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - getRecipeList
 *     description: Read all recipes. limit, skip, name are optional. User for pagination and searching
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of recipes to search for
 *         example: Cookies
 *       - in: query
 *         name: limit
 *         schema:
 *           type: int
 *         description: How many recipes to display
 *         example: 10
 *       - in: query
 *         name: skip
 *         schema:
 *           type: int
 *         description: How mane recipes to skip
 *         example: 20
 *
 *     responses:
 *       200:
 *         description: Recipe read successfully. If no recipe if found, empty array will be returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateGetRecipeList(),
  validate,
  recipeController.getRecipeList
);

/**
 * @swagger
 * /recipe/:id:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - readRecipeById
 *     description: Read recipe by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         description: Id of recipe for reading
 *         example: 60f7ea20cf60ae0004307aa2
 *
 *     responses:
 *       200:
 *         description: Recipe read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateReadRecipeById(),
  validate,
  recipeController.readRecipeById
);

/**
 * @swagger
 * /recipe/:
 *   put:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - updateRecipe
 *     description: Recipe update
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: recipe
 *         schema:
 *           $ref: '#components/schemas/Recipe'
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         description: Id of recipe for update
 *         example: 60f7ea20cf60ae0004307aa2
 *
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

router.put(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateUpdateRecipeData(),
  validate,
  recipeController.updateRecipe
);

export default router;
