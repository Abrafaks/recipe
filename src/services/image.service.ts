/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Image, ImageDocument } from "../models/image.model";
import { Recipe, RecipeDocument } from "../models/recipe.model";

interface Query {
  _id: string;
  userId?: string;
}

const rounds = 10;

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

  public async readRecipeImages(id: string) {
    return Image.find({ recipeId: id });
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
