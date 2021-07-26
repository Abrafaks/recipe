/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, response, Response } from "express";
import imageService, { ImageService } from "../services/image.service";
import sharp from "sharp";
import { matchedData } from "express-validator";

export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  public async addImage(req: Request, res: Response): Promise<Response> {
    try {
      const { _id, isAdmin } = req.user!;
      const { id: recipeId } = matchedData(req).id;
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
        return res.status(201).send();
      }
      return res.status(400).send({ savedImage });
    } catch (err) {
      return res.status(500).send();
    }
  }

  public async readRecipeImages(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = matchedData(req);
      const images = await imageService.readRecipeImages(id);
      if (images) {
        return res.send({ images });
      }
      return res.status(400).send();
    } catch (err) {
      return res.status(500).send();
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
        return res.status(400).send();
      }
      return res.send();
    } catch (err) {
      return res.status(500).send();
    }
  }
}

export default new ImageController(imageService);
