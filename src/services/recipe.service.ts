import { Image } from "../models/image.model";
import { Recipe, RecipeDocument } from "../models/recipe.model";
import { User } from "../models/user.model";

type CreateRecipeBody = Omit<Recipe, "userId">;

interface PaginationData {
  recipes: RecipeDocument[];
  page: number;
  pageSize: number;
  totalPages: number;
  firstPage: boolean;
  lastPage: boolean;
  totalElements: number;
  count: number;
}

interface QueryData {
  title?: RegExp;
  description?: RegExp;
}

interface DeleteRecipe {
  recipeId: string;
  userId?: string;
}

interface DeleteRecipeResult {
  recipeDeleted: boolean;
  recipeImagesDeleted: boolean;
}
export class RecipeService {
  public createRecipe(recipe: Recipe): Promise<RecipeDocument> {
    return new Recipe(recipe).save();
  }

  public async countDocuments(query: QueryData): Promise<number> {
    return Recipe.countDocuments(query);
  }

  public async getRecipeList(
    title: string | undefined,
    description: string | undefined,
    page: number,
    pageSize: number
  ): Promise<PaginationData> {
    let query: QueryData = {},
      skip: number,
      regexp = new RegExp(".*", "gmi"),
      firstPage: boolean = false,
      lastPage: boolean = false;

    if (title) {
      regexp = new RegExp(title, "gmi");
      query.title = regexp;
    }

    if (description) {
      regexp = new RegExp(description, "gmi");
      query.description = regexp;
    }

    const totalElements = await this.countDocuments(query);

    skip = pageSize * page;

    const totalPages = Math.ceil(totalElements / pageSize);

    if (page === 0) {
      firstPage = true;
    }

    if (page === totalPages) {
      lastPage = false;
    }

    const recipes = await Recipe.find(query, null, {
      skip,
      limit: pageSize,
    });

    const count = recipes.length;

    const paginationData = {
      recipes,
      page,
      pageSize,
      totalPages,
      firstPage,
      lastPage,
      totalElements,
      count,
    };

    return paginationData;
  }

  public async readRecipeById(id: string): Promise<RecipeDocument | null> {
    return Recipe.findById(id);
  }

  public async readRecipeByUserId(
    userId: string
  ): Promise<RecipeDocument[] | null> {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return null;
    }
    return Recipe.find({ userId });
  }

  public async updateRecipe(
    id: string,
    userId: string | null,
    { title, description, preparing, ingredients }: CreateRecipeBody
  ): Promise<RecipeDocument | null> {
    let result;
    if (!userId) {
      result = await Recipe.updateOne(
        { _id: id },
        { title, description, preparing, ingredients },
        {
          omitUndefined: true,
        }
      );
    } else {
      result = await Recipe.updateOne(
        { _id: id, userId },
        { title, description, preparing, ingredients },
        {
          omitUndefined: true,
        }
      );
    }

    if (result.nModified === 1) {
      return await Recipe.findOne({ _id: id });
    }

    return null;
  }

  public async deleteRecipeImages(recipeId: string): Promise<boolean> {
    const count = await Image.countDocuments({ recipeId });
    const { deletedCount } = await Image.deleteMany({ recipeId });
    return count === deletedCount;
  }

  public async deleteRecipeById({
    recipeId,
    userId,
  }: DeleteRecipe): Promise<DeleteRecipeResult> {
    const deleteRecipeResult: DeleteRecipeResult = {
      recipeDeleted: false,
      recipeImagesDeleted: false,
    };
    let query;
    if (!userId) {
      query = { _id: recipeId };
    } else {
      query = { _id: recipeId, userId };
    }
    const result = await Recipe.deleteOne(query);

    deleteRecipeResult.recipeDeleted = Boolean(result?.n === 1);

    if (deleteRecipeResult.recipeDeleted) {
      deleteRecipeResult.recipeImagesDeleted = await this.deleteRecipeImages(
        recipeId
      );
    }

    return deleteRecipeResult;
  }
}

export default new RecipeService();
