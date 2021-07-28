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
      const image = await sharp(req.file?.buffer).resize(500).png().toBuffer();
      const savedImage = await imageService.addRecipeImage(
        recipeId,
        image,
        _id,
        isAdmin
      );
      if (savedImage) {
        return res.status(StatusCodes.CREATED).send({ _id: savedImage._id });
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
      const { recipeId } = matchedData(req);

      const urls = await imageService.getUrls(recipeId);
      if (!urls) {
        return res.status(StatusCodes.NOT_FOUND).send();
      }

      return res.send(urls);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  public async readRecipeImage(req: Request, res: Response): Promise<Response> {
    try {
      const { imageId } = matchedData(req);
      const buffer = await imageService.readRecipeImage(imageId);
      if (buffer) {
        res.set("Content-Type", "image/png");
        return res.send(buffer);
      }
      return res.status(StatusCodes.NOT_FOUND).send();
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
