/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Recipe, RecipeDocument } from "../models/recipe.model";
import recipeService, { RecipeService } from "../services/recipe.service";
import { StatusCodes } from "http-status-codes";

export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  public async createRecipe(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, preparing, ingredients } = matchedData(req);
      const { _id } = req.user!;
      const recipeData: Recipe = {
        title,
        description,
        preparing,
        ingredients,
        userId: _id,
      };

      const savedRecipe = await recipeService.createRecipe(recipeData);
      return res.status(StatusCodes.CREATED).send(savedRecipe);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async getRecipeList(
    req: Request,
    res: Response
  ): Promise<Response<RecipeDocument[]>> {
    try {
      const { skip, limit, name } = matchedData(req);

      const recipes = await recipeService.getRecipeList(name, skip, limit);
      return res.json(recipes);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async readRecipeById(
    req: Request,
    res: Response
  ): Promise<Response<RecipeDocument>> {
    try {
      const { id } = matchedData(req);

      const recipe = await recipeService.readRecipeById(id);

      if (recipe) {
        return res.json(recipe);
      }
      return res.status(StatusCodes.NOT_FOUND).send();
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async updateRecipe(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, preparing, ingredients, id } =
        matchedData(req);
      const { _id, isAdmin } = req.user!;
      let result: RecipeDocument | null;

      if (isAdmin) {
        result = await recipeService.updateRecipe(id, null, {
          title,
          description,
          preparing,
          ingredients,
        });
      } else {
        result = await recipeService.updateRecipe(id, _id, {
          title,
          description,
          preparing,
          ingredients,
        });
      }
      if (result) {
        return res.send(result);
      } else {
        return res.status(StatusCodes.BAD_REQUEST).send();
      }
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async readUserRecipesById(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id: readUserId } = matchedData(req);

      const recipes = await recipeService.readRecipeByUserId(readUserId);

      if (!recipes) {
        return res.status(StatusCodes.NOT_FOUND).send();
      }
      return res.send(recipes);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async deleteRecipeById(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id: recipeId } = matchedData(req);
      const { _id: userId, isAdmin } = req.user!;
      let query;
      if (isAdmin) {
        query = { recipeId };
      } else {
        query = { recipeId, userId };
      }
      const result = await recipeService.deleteRecipeById(query);
      if (result) {
        return res.status(StatusCodes.NO_CONTENT).send();
      } else {
        return res.status(StatusCodes.NOT_FOUND).send();
      }
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}

export default new RecipeController(recipeService);
