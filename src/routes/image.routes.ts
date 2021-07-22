import express from "express";
import imageController from "../controllers/image.controller";
import { Strategy, auth } from "./middleware/auth";
import imageValidator, {
  upload,
} from "./middleware/validators/image.validator";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - register
 *     description: Account creation
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         schema:
 *           $ref: '#components/schemas/User'
 *
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/UserDocument'
 *       400:
 *         description: Account with this email already exists.
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
 *       - addImage
 *     description: Add image
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           description: Id of post
 *           example: 60f7ea20cf60ae0004307aa2
 *       - in: form-data
 *         name: image
 *         schema:
 *           type: Buffer
 *           description: Image
 *           example:  |
 *             <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44
 *             52 00 00 04 18 00 00 00 ca 08 06 00 00 00 0f 58 f3 5e
 *             00 00 18 86 69 43 43 50 49 43 43 20 50 72 6f 66 69
 *             ... 115777 more bytes>
 *
 *     responses:
 *       201:
 *         description: Image added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

router.post(
  "/:id",
  auth.authenticate([Strategy.Bearer]),
  upload.single("image"),
  imageValidator.validateAddImageData(),
  validate,
  imageController.addImage
);

export default router;
