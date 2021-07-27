import { Document, Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *           example: some@example.com
 *         password:
 *           type: string
 *           description: Strong password - min 8 chars, 1 uppercase, 1 lowercase, 1 sign and 1 number
 *           example: Password1!
 *       required:
 *         - email
 *         - password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDocument:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *           example: some@example.com
 *         password:
 *           type: string
 *           description: Strong password - min 8 chars, 1 uppercase, 1 lowercase, 1 sign and 1 number
 *           example: Password1!
 *         isAdmin:
 *           type: boolean
 *           description: Defines if user is admin
 *           default: false
 *           example: false
 *         _id:
 *           type: string
 *           description: User MongoDb id
 *           example: 60f7e9b8cf60ae0004307aa1
 *         passwordHash:
 *           type: string
 *           description: To be deleted.
 *       required:
 *         - email
 *         - password
 *         - _id
 */

export interface User {
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}

export interface UserDocument extends User, Document {}

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.passwordHash;
  delete userObject.__v;

  return userObject;
};

export const User = model<UserDocument>("user", userSchema);
