import express from "express";
import auth from "./middleware/auth";
import * as recipe_controller from "../controllers/recipe.controller";

const router = express.Router();

router.post("/create", auth, recipe_controller.create);
router.post("/read", auth, recipe_controller.read);

// Shouldn't it be changed to put?
router.post("/update", auth, recipe_controller.update);

// And this will be changed to get
// router.post("/readByName", auth, recipe_controller.readByName);

export default router;
