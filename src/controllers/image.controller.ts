/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import imageService, { ImageService } from "../services/image.service";
import sharp from "sharp";
import { matchedData } from "express-validator";

interface UserAuthData {
  email: string;
  password: string;
}

export class ImageController {
  constructor(private imageService: ImageService) {}

  public async addImage(req: Request, res: Response): Promise<Response> {
    try {
      const { _id, isAdmin } = req.user!;
      const recipeId: string = matchedData(req).id;
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
      console.log(err);
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
}

export default new ImageController(imageService);
