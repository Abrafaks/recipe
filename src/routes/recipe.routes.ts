import express from "express";
import recipeController from "../controllers/recipe.controller";
import { Strategy, auth } from "./middleware/auth";
import recipeValidator from "./middleware/validators/recipe.validator";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

router.post(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateCreateRecipeData(),
  validate,
  recipeController.createRecipe
);

router.get(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateGetRecipeList(),
  validate,
  recipeController.getRecipeList
);

router.get(
  "/:id",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateReadRecipeById(),
  validate,
  recipeController.readRecipeById
);

router.put(
  "/",
  auth.authenticate([Strategy.Bearer]),
  recipeValidator.validateUpdateRecipeData(),
  validate,
  recipeController.updateRecipe
);

export default router;
