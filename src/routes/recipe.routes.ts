import express from "express";
import auth from "./middleware/auth";
import * as recipeController from "../controllers/recipe.controller";

const router = express.Router();
// this one is working
router.post("/", auth, recipeController.create);

router.get("/", auth, recipeController.readAll);

router.get("/:id", auth, recipeController.read);

router.get("/readByName", auth, recipeController.readByName);

router.put("/", auth, recipeController.update);

export default router;
