import { Request, Response } from "express";
import { Recipe, RecipeDocument } from "../models/recipe.model";
import { UserDocument } from "../models/user.model";
import recipeService, { RecipeService } from "../services/recipe.service";

type CreateRecipeBody = Omit<Recipe, "userId">;

interface RecipeWithId extends Recipe {
  id: string;
}

interface Pagination {
  skip: number;
  limit: number;
}

export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  public async createRecipe(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, preparing, ingredients, url } =
        req.body as CreateRecipeBody;
      const { _id } = req.user!;

      const recipeData: Recipe = {
        title,
        description,
        preparing,
        ingredients,
        userId: _id,
        url,
      };

      const savedRecipe = await recipeService.createRecipe(recipeData);
      return res.send(savedRecipe);
    } catch (err) {
      return res.status(500).send();
    }
  }

  public async getRecipeList(
    req: Request,
    res: Response
  ): Promise<Response<RecipeDocument[]>> {
    try {
      const { _id, isAdmin } = req.user!;
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

      if (isAdmin) {
        recipes = await recipeService.getRecipeList(
          null,
          parsedName,
          parsedSkip,
          parsedLimit
        );
      } else {
        recipes = await recipeService.getRecipeList(
          _id,
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

  public async readRecipeById(
    req: Request,
    res: Response
  ): Promise<Response<RecipeDocument>> {
    try {
      const { id } = req.params;

      const recipe = await recipeService.readRecipeById(id);
      return res.json(recipe);
    } catch (err) {
      return res.status(500).send();
    }
  }

  public async updateRecipe(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, preparing, ingredients, url, id } =
        req.body as RecipeWithId;
      const { _id, isAdmin } = req.user!;
      let result: boolean;

      if (isAdmin) {
        result = await recipeService.updateRecipe(id, null, {
          title,
          description,
          preparing,
          ingredients,
          url,
        });
      } else {
        result = await recipeService.updateRecipe(id, _id, {
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
        return res.status(400).send();
      }
    } catch (err) {
      return res.status(500).send();
    }
  }
}

export default new RecipeController(recipeService);
