import express from "express";
import userController from "../controllers/user.controller";
import { Strategy, auth } from "./middleware/auth";
import userValidator from "./middleware/validators/user.validator";
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
 *           $ref: '#/definitions/User'
 *
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Account with this email already exists.
 *       500:
 *         description: Internal server error
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
 *       - login
 *     description: Account creation
 *
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         examples:
 *           application/json: { token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGY3ZTliOGNmNjBhZTAwMDQzMDdhYTEiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjI2ODYwMDQxfQ.K-JUtYXCHlv4e1YQJYYi6bUISG_s0zdirSq0GBAshIo }
 *       500:
 *         description: Internal server error
 */

router.post(
  "/login",
  auth.authenticate([Strategy.Basic]),
  userController.login
);

export default router;
