import express, { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import multer from "multer";
import { StatusCodes } from "http-status-codes";
import imageController from "../controllers/image.controller";
import { Strategy, auth } from "./middleware/auth";
import imageValidator, {
  upload,
} from "./middleware/validators/image.validator";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

/**
 * @swagger
 * /images/:recipeId:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - image
 *     description: Returns links to all recipe images
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7ea20cf60ae0004307aa2
 *         description: Id of recipe
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Found images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:  |
 *                [
 *                  "https://mooduprecipeapi.herokuapp.com/images/6101367483d3a334b3c3872c/display",
 *                  "https://mooduprecipeapi.herokuapp.com/images/6101367583d3a334b3c3872d/display",
 *                  "https://mooduprecipeapi.herokuapp.com/images/6101367783d3a334b3c3872e/display",
 *                  "https://mooduprecipeapi.herokuapp.com/images/6101367983d3a334b3c3872f/display",
 *                  "https://mooduprecipeapi.herokuapp.com/images/610143908ad6243873aa32aa/display",
 *                  "https://mooduprecipeapi.herokuapp.com/images/610143bf2cdc60388409e11c/display",
 *                  "https://mooduprecipeapi.herokuapp.com/images/610144165e525138ab94f705/display"
 *                ]
 *       400:
 *         description: No images found
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/:recipeId",
  imageValidator.validateReadRecipeImagesData(),
  validate,
  imageController.readRecipeImages
);

/**
 * @swagger
 * /images/:imageId/display:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - image
 *     description: Returns recipe image as png file
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7ea20cf60ae0004307aa2
 *         description: Id of recipe
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Found image
 *         content:
 *           image/png:
 *             schema:
 *               type: png
 *       400:
 *         description: No image found
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/:imageId/display",
  imageValidator.validateReadRecipeImageData(),
  validate,
  imageController.readRecipeImage
);

/**
 * @swagger
 * /images/:id:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - image
 *     description: Add image
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7ea20cf60ae0004307aa2
 *         description: Id of recipe
 *         required: true
 *       - in: form-data
 *         name: image
 *         schema:
 *           type: Buffer
 *           example:  |
 *             <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44
 *             52 00 00 04 18 00 00 00 ca 08 06 00 00 00 0f 58 f3 5e
 *             00 00 18 86 69 43 43 50 49 43 43 20 50 72 6f 66 69
 *             ... 115777 more bytes>
 *         description: Image buffer
 *         required: true
 *
 *     responses:
 *       201:
 *         description: Image added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: { _id: "610143bf2cdc60388409e11c" }
 *       400:
 *         description: |
 *           Bad request. Errors:
 *           'Please upload png, jpeg or jpg.',
 *           'Too many parts',
 *           'File too large',
 *           'Too many files',
 *           'Field name too long',
 *           'Field value too long',
 *           'Too many fields',
 *           'Unexpected field'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {error: "Too many fields"}
 *       401:
 *         description: Unauthorized
 */

const uploadImage = upload.single("image");

router.post(
  "/:id",
  auth.authenticate([Strategy.Bearer]),
  (req: Request, res: Response, next: NextFunction) =>
    uploadImage(req, res, (err) => {
      if (
        err instanceof multer.MulterError ||
        err?.message === "Please upload png, jpeg or jpg."
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
      }
      next();
    }),
  imageValidator.validateAddImageData(),
  validate,
  imageController.addImage
);

/**
 * @swagger
 * /images/:id:
 *   delete:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - image
 *     description: Delete image
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7ea20cf60ae0004307aa2
 *         description: Id of image
 *         required: true
 *
 *     responses:
 *       204:
 *         description: Image deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

router.delete(
  "/:id",
  auth.authenticate([Strategy.Bearer]),
  imageValidator.validateDeleteRecipeByIdData(),
  validate,
  imageController.deleteImageById
);

export default router;
