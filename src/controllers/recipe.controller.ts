import express from "express";
import { Request, Response } from "express";
import { Recipe } from "../models/recipe.model";
import * as recipe_services from "../services/recipe.service";

const router = express.Router();

type CreateRecipeBody = Omit<Recipe, "userId">;

interface RecipeWithId extends Recipe {
  id: string;
}

interface Pagination {
  skip: number;
  limit: number;
}
/*

router.post(
  "/create",
  auth,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, description, preparing, ingredients, url } =
        req.body as CreateRecipeBody;

      if (!title || !description || !preparing || !ingredients || !url) {
        return res
          .status(400)
          .json({ errorMessage: "Please enter all required data." });
      }

      const recipeData: Recipe = {
        title,
        description,
        preparing,
        ingredients,
        userId: req.userId,
        url,
      };
      const newRecipe = new Recipe(recipeData);

      const savedRecipe = await newRecipe.save();

      return res.json(savedRecipe);
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
);

// reading recipes - if user is admin, then he sees all,
// else user sees only recipes created by him

// skip: number of items to skip, limit: how much to show
router.post(
  "/read",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, admin } = req;
      const { skip, limit } = req.body as Pagination;

      if (admin) {
        Recipe.find({}, null, { skip, limit }, (err, result) => {
          if (err) console.log(err);
          else res.send(result);
        });
      } else {
        Recipe.find({ userId }, null, { skip, limit }, (err, result) => {
          if (err) console.log(err);
          else res.send(result);
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
);

// reading recipe by id
router.get(
  "/readbyid",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.body;

      const recipes = await Recipe.find({ _id: id });
      res.json(recipes);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
);
*/
export async function create(req: Request, res: Response): Promise<void> {}
export async function read(req: Request, res: Response): Promise<void> {}
export async function update(req: Request, res: Response): Promise<Response> {
  try {
    const { title, description, preparing, ingredients, url, id } =
      req.body as RecipeWithId;
    const { userId, admin } = req;
    let result: boolean;

    if (admin) {
      result = await recipe_services.updateRecipe(id, null, {
        title,
        description,
        preparing,
        ingredients,
        url,
      });
    } else {
      result = await recipe_services.updateRecipe(id, userId, {
        title,
        description,
        preparing,
        ingredients,
        url,
      });
    }
    if (result) {
      return res.send();
    } else {
      // recipe doesn't belong to user or he sent the same copy and it wasn't modified
      return res.status(400).send();
    }
  } catch (err) {
    return res.status(500).send();
  }
}

// find recipe by exact name (title)
export async function readByName(
  req: Request,
  res: Response
): Promise<Response<Recipe[]>> {
  try {
    const { name } = req.body;

    const recipes = await recipe_services.filterRecipesByName(res, name);

    return res.json(recipes);
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

export default router;
