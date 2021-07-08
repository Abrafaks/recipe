import express from "express";
import auth from "./middleware/auth";
import * as recipeController from "../controllers/recipe.controller";

const router = express.Router();

router.post("/create", auth, recipeController.create);

router.post("/readAll", auth, recipeController.readAll);

router.post("/read", auth, recipeController.read);

// Shouldn't it be changed to put?
router.post("/update", auth, recipeController.update);

// And this will be changed to get
router.post("/readByName", auth, recipeController.readByName);

export default router;
