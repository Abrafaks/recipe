import express, { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import multer, { ErrorCode } from "multer";
import imageController from "../controllers/image.controller";
import { Strategy, auth } from "./middleware/auth";
import imageValidator, {
  upload,
} from "./middleware/validators/image.validator";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

/**
 * @swagger
 * /image/:id:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - image
 *     description: Read all recipe images
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7ea20cf60ae0004307aa2
 *         description: Id of post
 *
 *     responses:
 *       200:
 *         description: Found images
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/ImageDocument'
 *       400:
 *         description: No images found
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/:id",
  imageValidator.validateReadRecipeImagesData(),
  validate,
  imageController.readRecipeImages
);

/**
 * @swagger
 * /image/:id:
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
 *         description: Id of post
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
 *
 *     responses:
 *       201:
 *         description: Image added successfully
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
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      next();
    }),
  imageValidator.validateAddImageData(),
  validate,
  imageController.addImage,
  (req: Request, res: Response) => imageController.addImage(req, res)
);

/**
 * @swagger
 * /image/:id:
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
 *         description: Id of post
 *
 *     responses:
 *       200:
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
