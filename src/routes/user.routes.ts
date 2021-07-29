import express from "express";
import { User } from "../models/user.model";
import userController from "../controllers/user.controller";
import { Strategy, auth } from "./middleware/auth";
import userValidator from "./middleware/validators/user.validator";
import { validate } from "./middleware/validators/validator";

const router = express.Router();

/**
 * @swagger
 * /auth/:
 *   get:
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
 *       404:
 *         description: Not found
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
 * /auth/me:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - user
 *     description: Read current user
 *
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/UserDocument'
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/me",
  auth.authenticate([Strategy.Bearer]),
  userController.readCurrentUser
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

/**
 * @swagger
 * /auth/:id/delete/:
 *   put:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - user
 *     description:  |
 *       Soft delete user. Admin can delete any user by specifying id in params.
 *       Normal user has to specify his id. (find your id in route GET /auth/me)
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of user to delete. If not specified, will delete current user
 *         example: 60f7ea20cf60ae0004307aa2
 *
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

router.put(
  "/:id/delete/",
  auth.authenticate([Strategy.Bearer]),
  userValidator.validateUserToDelete(),
  validate,
  userController.deleteUserById
);

// DEVELOPMENT FEATURE
// EMERGENCY ADMIN CREATION
// DELETE ON PRODUCTION

/**
 * @swagger
 * /auth/createadmin:
 *   post:
 *     tags:
 *       - user
 *     description:  |
 *       Testowe. Tworzy admina. Passy na slacku.
 *
 */

router.post("/createadmin", async (req, res) => {
  const admin = {
    email: "admin@a.com",
    passwordHash:
      "$2b$10$fohdZXj29Pi/7fBdoy8PW.iUXRribKhigUaMyt14wg5EhtGsMPgK2",
    isDeleted: false,
    isAdmin: true,
  };

  const isTaken = await User.findById({ email: admin.email });
  if (isTaken) {
    return res.status(400).send("A nie ma juz tego admina utworzonego?");
  }
  const saved = await new User(admin).save();

  return res.status(201).send(saved);
});

export default router;
