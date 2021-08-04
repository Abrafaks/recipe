/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Image, ImageDocument } from "../models/image.model";
import { Recipe, RecipeDocument } from "../models/recipe.model";

interface ImageResult {
  FORBIDDEN: boolean;
  NOT_FOUND: boolean;
  OK: boolean;
  imageId?: string;
}

export class ImageService {
  public async readRecipeById(
    recipeId: string
  ): Promise<RecipeDocument | null> {
    return Recipe.findById(recipeId);
  }

  public async addRecipeImage(
    recipeId: string,
    image: Buffer,
    userId: string,
    isAdmin: boolean
  ): Promise<ImageResult> {
    const addImageResult: ImageResult = {
      OK: false,
      FORBIDDEN: false,
      NOT_FOUND: false,
    };

    const recipe = await this.readRecipeById(recipeId);

    if (!recipe) {
      addImageResult.NOT_FOUND = true;
      return addImageResult;
    }

    if (!isAdmin && recipe.userId !== userId.toString()) {
      addImageResult.FORBIDDEN = true;
      return addImageResult;
    }

    const savedImage = await new Image({
      recipeId: recipe._id,
      image,
    }).save();

    addImageResult.OK = true;
    addImageResult.imageId = savedImage._id;
    return addImageResult;
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
  ): Promise<ImageResult> {
    const deleteImageResult: ImageResult = {
      OK: false,
      FORBIDDEN: false,
      NOT_FOUND: false,
    };

    const image = await Image.findById(imageId);

    if (!image) {
      deleteImageResult.NOT_FOUND = true;
      return deleteImageResult;
    }

    const recipe = await Recipe.findById(image.recipeId);

    if (!isAdmin && recipe?.userId !== userId.toString()) {
      deleteImageResult.FORBIDDEN = true;
      return deleteImageResult;
    }

    const isImageDeleted = await Image.deleteOne({ _id: imageId });

    deleteImageResult.OK = Boolean(isImageDeleted?.ok);
    deleteImageResult.imageId = imageId;
    return deleteImageResult;
  }
}

export default new ImageService();
