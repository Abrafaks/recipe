import { Document, Schema, model } from "mongoose";

/**
 * @swagger
 * tags:
 * - name: User
 *   description: "User model"
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       email:
 *          type: string
 *          description: User email
 *          example: some@example.com
 *       password:
 *          type: string
 *          description: Strong password - min 8 chars, 1 uppercase, 1 lowercase, 1 sign and 1 number
 *          example: Password1!
 *       isAdmin:
 *         type: boolean
 *         description: Defines if user is admin. Default false
 *         example: false
 *     required:
 *       - email
 *       - password
 *
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

export const User = model<UserDocument>("user", userSchema);
