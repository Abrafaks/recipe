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
