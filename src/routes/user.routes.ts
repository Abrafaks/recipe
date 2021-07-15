import express from "express";
import userController from "../controllers/user.controller";
import { Strategy, auth } from "./middleware/auth";
import UserValidator from "./middleware/validators/user.validator";

const router = express.Router();

router.post(
  "/register",
  UserValidator.validateEmail(),
  UserValidator.validatePassword(),
  UserValidator.validateUser,
  userController.register
);

router.post(
  "/login",
  auth.authenticate([Strategy.Basic]),
  userController.login
);

export default router;
