import express from "express";
import auth from "./middleware/auth";
import recipeController from "../controllers/recipe.controller";

const router = express.Router();

router.post("/", auth, recipeController.createRecipe);

router.get("/", auth, recipeController.getRecipeList);

router.get("/:id", auth, recipeController.readRecipeById);

router.put("/", auth, recipeController.updateRecipe);

export default router;
