import { Document, Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         image:
 *            type: buffer
 *            description: Image of the recipe
 *            example:  |
 *              <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44
 *              52 00 00 04 18 00 00 00 ca 08 06 00 00 00 0f 58 f3 5e
 *              00 00 18 86 69 43 43 50 49 43 43 20 50 72 6f 66 69
 *              ... 115777 more bytes>
 *         recipeId:
 *            type: string
 *            description: MongoDB id of recipe associated with image
 *            example: 60f7e9b8cf60ae0004307aa1
 *       required:
 *         - recipeId
 *         - image
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ImageDocument:
 *       type: object
 *       properties:
 *         image:
 *            type: buffer
 *            description: Image of the recipe
 *              <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44
 *              52 00 00 04 18 00 00 00 ca 08 06 00 00 00 0f 58 f3 5e
 *              00 00 18 86 69 43 43 50 49 43 43 20 50 72 6f 66 69
 *              ... 115777 more bytes>
 *         _id:
 *            type: string
 *            description: Image MongoDB id
 *            example: 60f7ea20cf60ae0004307aa2
 *         recipeId:
 *            type: string
 *            description: MongoDB id of recipe associated with image
 *            example: 60f7e9b8cf60ae0004307aa1
 *       required:
 *         - recipeId
 *         - image
 *         - _id
 *
 */
export interface Image {
  recipeId: string;
  image: Buffer;
}
export interface ImageDocument extends Image, Document {}

const imageSchema = new Schema<Image>({
  recipeId: { type: String, required: true },
  image: { type: Buffer, required: true },
});

export const Image = model<ImageDocument>("image", imageSchema);
