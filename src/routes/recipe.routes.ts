import express from "express";
import auth from "./middleware/auth";
import recipeController from "../controllers/recipe.controller";
import passport from "passport";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  recipeController.createRecipe
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  recipeController.getRecipeList
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  recipeController.readRecipeById
);

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  recipeController.updateRecipe
);

export default router;
