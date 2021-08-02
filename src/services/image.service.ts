/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Image, ImageDocument } from "../models/image.model";
import { Recipe, RecipeDocument } from "../models/recipe.model";

interface Query {
  _id: string;
  userId?: string;
}

export class ImageService {
  public async readRecipeById(
    id: string,
    userId: string,
    isAdmin: boolean
  ): Promise<RecipeDocument | null> {
    let query: Query = {
      _id: id,
      userId,
    };
    if (isAdmin) {
      delete query.userId;
    }
    return Recipe.findOne(query);
  }

  public async addRecipeImage(
    id: string,
    image: Buffer,
    userId: string,
    isAdmin: boolean
  ): Promise<ImageDocument | null> {
    const recipe = await this.readRecipeById(id, userId, isAdmin);
    if (!recipe) {
      return null;
    }

    return new Image({
      recipeId: recipe._id,
      image,
    }).save();
  }

  public async readRecipeImages(recipeId: string) {
    return Image.find({ recipeId });
  }
  public async readRecipeImage(imageId: string): Promise<Buffer | null> {
    const { image } = (await Image.findById(imageId)) || {};
    if (!image) {
      return null;
    }

    return image;
  }

  public async getRecipe(recipeId: string): Promise<RecipeDocument | null> {
    return Recipe.findById(recipeId);
  }

  public async getUrls(recipeId: string): Promise<string[] | null> {
    let urls: Array<string> = [];

    const images = await this.readRecipeImages(recipeId);

    images.forEach((element) => {
      urls.push(`${process.env.API_BASE_URL}/images/${element._id}/display`);
    });
    return urls;
  }

  public async deleteImageById(
    imageId: string,
    userId: string,
    isAdmin: boolean
  ): Promise<ImageDocument | null> {
    const image = await Image.findOne({ _id: imageId });

    if (!image) {
      return null;
    }

    const recipe = await this.readRecipeById(image.recipeId, userId, isAdmin);

    if (!recipe) {
      return null;
    }

    return Image.findOneAndDelete({ _id: imageId });
  }
}

export default new ImageService();
