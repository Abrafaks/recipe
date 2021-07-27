/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, response, Response } from "express";
import imageService, { ImageService } from "../services/image.service";
import sharp from "sharp";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";

export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  public async addImage(req: Request, res: Response): Promise<Response> {
    try {
      const { _id, isAdmin } = req.user!;
      const { id: recipeId } = matchedData(req);
      const image = await sharp(req.file?.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      const savedImage = await imageService.addRecipeImage(
        recipeId,
        image,
        _id,
        isAdmin
      );
      if (savedImage) {
        return res.status(StatusCodes.CREATED).send();
      }
      return res.status(StatusCodes.BAD_REQUEST).send();
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async readRecipeImages(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = matchedData(req);
      const images = await imageService.readRecipeImages(id);
      if (images?.length !== 0) {
        return res.send(images);
      }
      return res.status(StatusCodes.BAD_REQUEST).send();
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
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

      if (!deletedImage) {
        return res.status(StatusCodes.BAD_REQUEST).send();
      }
      return res.send();
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}

export default new ImageController(imageService);
