import express from "express";
import userController from "../controllers/user.controller";
import { Strategy, auth } from "./middleware/auth";

const router = express.Router();

router.post("/register", userController.register);

router.post(
  "/login",
  auth.authenticate([Strategy.Basic]),
  userController.login
);

export default router;
