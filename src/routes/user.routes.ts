import express from "express";
import userController from "../controllers/user.controller";
import { Strategy, auth } from "./middleware/auth";
import userValidator from "./middleware/validators/user.validator";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - user
 *     description: Read all users
 *
 *     responses:
 *       200:
 *         description: Users found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/UserDocument'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/",
  auth.authenticate([Strategy.Bearer]),
  userController.readAllUsers
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - user
 *     description: Account registration
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

router.post(
  "/register",
  userValidator.validateUser(),
  validate,
  userController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     security:
 *       - Basic: []
 *     tags:
 *       - user
 *     description: Logging in
 *
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGY3ZTliOGNmNjBhZTAwMDQzMDdhYTEiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjI2ODYwMDQxfQ.K-JUtYXCHlv4e1YQJYYi6bUISG_s0zdirSq0GBAshIo }
 *       401:
 *         description: Unauthorized
 */

router.post(
  "/login",
  auth.authenticate([Strategy.Basic]),
  userController.login
);

export default router;
