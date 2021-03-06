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
 *       - recipe
 *     description: Create recipe
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: recipe
 *         schema:
 *           $ref: '#components/schemas/Recipe'
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       400:
 *         description: Bad request
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
 *       - recipe
 *     description:  |
 *       Read all recipes. Title and description are optional.
 *       Used for pagination and searching
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *         example: Chocolate cookies
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by description
 *         example: Cookies always were my favorite food
 *       - in: query
 *         name: page
 *         schema:
 *           type: int
 *         description: Which page to display [ min 0, max 100 ]
 *         example: 0
 *         required: true
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: int
 *         description: How many recipes to display per page [ max 1 000 000 000 ]
 *         example: 20
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Recipe read successfully. If no recipe is found, empty array will be returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeQuery'
 *       400:
 *         description: Bad request
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
 *       - recipe
 *     description: Read recipe by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of recipe for reading
 *         example: 60f7ea20cf60ae0004307aa2
 *         required: true
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
 * /recipe/user/:id:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - recipe
 *     description: Read recipes of user by his id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of user
 *         example: 60f7ea20cf60ae0004307aa2
 *
 *     responses:
 *       200:
 *         description: Recipes read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/user/:id",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateReadUserRecipesById(),
  validate,
  recipeController.readUserRecipesById
);

/**
 * @swagger
 * /recipe/:id:
 *   put:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - recipe
 *     description: Update recipe. All fields are optional
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: recipe
 *         schema:
 *           $ref: '#components/schemas/Recipe'
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of recipe to update
 *         example: 60f7ea20cf60ae0004307aa2
 *
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - there is recipe, but it's not yours.
 *       404:
 *         description: Not found - there is not such recipe in entire db.
 *
 */

router.put(
  "/:id",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateUpdateRecipeData(),
  validate,
  recipeController.updateRecipe
);

/**
 * @swagger
 * /recipe/:recipeId:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - recipe
 *     description: Delete user's recipe. Admin can delete any recipe
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of recipe to delete
 *         example: 60f7ea20cf60ae0004307aa2
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:  |
 *                 {
 *                   recipeDeleted: true,
 *                   recipeImagesDeleted: true,
 *                 }
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

router.delete(
  "/:recipeId",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateDeleteRecipeData(),
  validate,
  recipeController.deleteRecipeById
);

export default router;
