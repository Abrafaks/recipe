/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, response, Response } from "express";
import imageService, { ImageService } from "../services/image.service";
import sharp from "sharp";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { StringDecoder } from "string_decoder";

export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  public async addImage(req: Request, res: Response): Promise<Response> {
    try {
      const { _id, isAdmin } = req.user!;
      const { id: recipeId } = matchedData(req);
      const imageResize = 500;
      const image = await sharp(req.file?.buffer)
        .resize(imageResize)
        .png()
        .toBuffer();
      const savedImage = await imageService.addRecipeImage(
        recipeId,
        image,
        _id,
        isAdmin
      );

      if (savedImage.FORBIDDEN) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }

      if (savedImage.NOT_FOUND) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      if (savedImage.OK) {
        return res
          .status(StatusCodes.CREATED)
          .send({ _id: savedImage.imageId });
      }
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async readRecipeImages(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { recipeId } = matchedData(req);
      const recipe = await imageService.getRecipe(recipeId);

      if (!recipe) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      const urls = await imageService.getUrls(recipeId);

      return res.send(urls);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async readRecipeImage(req: Request, res: Response): Promise<Response> {
    try {
      const { _id: userId, isAdmin } = req.user!;
      const { imageId } = matchedData(req);
      const buffer = await imageService.readRecipeImage(imageId);
      if (buffer) {
        res.set("Content-Type", "image/png");
        return res.send(buffer);
      }
      return res.sendStatus(StatusCodes.NOT_FOUND);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteImageById(req: Request, res: Response): Promise<Response> {
    try {
      const { _id: userId, isAdmin } = req.user!;
      const { id: imageId } = matchedData(req);

      const deletedImage = await imageService.deleteImageById(
        imageId,
        userId,
        isAdmin
      );

      if (deletedImage.FORBIDDEN) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }

      if (deletedImage.NOT_FOUND) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      if (deletedImage.OK) {
        return res.sendStatus(StatusCodes.OK);
      }
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    } catch (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new ImageController(imageService);
