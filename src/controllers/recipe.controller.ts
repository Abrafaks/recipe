import { Request, Response } from "express";
import { Recipe, RecipeDocument } from "../models/recipe.model";
import * as recipeServices from "../services/recipe.service";

type CreateRecipeBody = Omit<Recipe, "userId">;

interface RecipeWithId extends Recipe {
  id: string;
}

interface Pagination {
  skip: number;
  limit: number;
}

export async function create(req: Request, res: Response): Promise<Response> {
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

    const savedRecipe = await recipeServices.createRecipe(recipeData);
    return res.send(savedRecipe);
  } catch (err) {
    return res.status(500).send();
  }
}

// reading recipes - if user is admin, then he sees all,
// else user sees only recipes created by him
// skip: number of items to skip, limit: how much to show
// added filtering
export async function readAll(
  req: Request,
  res: Response
): Promise<Response<RecipeDocument[]>> {
  try {
    const { userId, admin } = req;
    const { skip, limit, name } = req.query;
    let parsedName;
    let recipes;
    const parsedSkip = Number(skip);
    const parsedLimit = Number(limit);

    if (name === undefined) {
      parsedName = null;
    } else {
      parsedName = String(name);
    }

    if (admin) {
      recipes = await recipeServices.readAllRecipes(
        null,
        parsedName,
        parsedSkip,
        parsedLimit
      );
    } else {
      recipes = await recipeServices.readAllRecipes(
        userId,
        parsedName,
        parsedSkip,
        parsedLimit
      );
    }
    return res.json(recipes);
  } catch (err) {
    return res.status(500).send();
  }
}

// Reading recipe by id
export async function read(
  req: Request,
  res: Response
): Promise<Response<RecipeDocument>> {
  try {
    const { id } = req.params;

    const recipe = await recipeServices.readRecipeById(id);
    return res.json(recipe);
  } catch (err) {
    return res.status(500).send();
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  try {
    const { title, description, preparing, ingredients, url, id } =
      req.body as RecipeWithId;
    const { userId, admin } = req;
    let result: boolean;

    if (admin) {
      result = await recipeServices.updateRecipe(id, null, {
        title,
        description,
        preparing,
        ingredients,
        url,
      });
    } else {
      result = await recipeServices.updateRecipe(id, userId, {
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
