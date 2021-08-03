/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Recipe, RecipeDocument } from "../models/recipe.model";
import recipeService, { RecipeService } from "../services/recipe.service";
import webhookService, { WebhookService } from "../services/webhook.service";
import { StatusCodes } from "http-status-codes";

export class RecipeController {
  constructor(
    private recipeService: RecipeService,
    private webhookService: WebhookService
  ) {}

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

      const savedRecipe = (
        await recipeService.createRecipe(recipeData)
      ).toJSON();

      savedRecipe._id = savedRecipe._id.toString();

      webhookService.webhookHandler(_id, "create_recipe", savedRecipe);
      return res.status(StatusCodes.CREATED).send(savedRecipe);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async getRecipeList(
    req: Request,
    res: Response
  ): Promise<Response<RecipeDocument[]>> {
    try {
      const { title, description, page, pageSize } = matchedData(req);
      const recipes = await recipeService.getRecipeList(
        title,
        description,
        page,
        pageSize
      );

      return res.json(recipes);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
      return res.sendStatus(StatusCodes.NOT_FOUND);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateRecipe(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, preparing, ingredients, id } =
        matchedData(req);
      const { _id: userId, isAdmin } = req.user!;

      const updatedRecipe = await recipeService.updateRecipe(
        id,
        userId,
        isAdmin,
        {
          title,
          description,
          preparing,
          ingredients,
        }
      );

      if (updatedRecipe.FORBIDDEN) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }

      if (updatedRecipe.NOT_FOUND) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      if (updatedRecipe.OK && updatedRecipe.recipe) {
        const jsonedRecipe = updatedRecipe.recipe?.toJSON();
        jsonedRecipe._id = jsonedRecipe._id.toString();
        webhookService.webhookHandler(userId, "update_recipe", jsonedRecipe);

        return res.send(updatedRecipe.recipe);
      }

      return res.sendStatus(StatusCodes.BAD_REQUEST);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }
      return res.send(recipes);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteRecipeById(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { recipeId } = matchedData(req);
      const { _id: userId, isAdmin } = req.user!;
      let query;
      if (isAdmin) {
        query = { recipeId };
      } else {
        query = { recipeId, userId };
      }
      const result = await recipeService.deleteRecipeById(query);

      if (result.recipeDeleted && result.recipeImagesDeleted) {
        webhookService.webhookHandler(userId, "delete_recipe", null, recipeId);

        return res.sendStatus(StatusCodes.OK);
      } else {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new RecipeController(recipeService, webhookService);
