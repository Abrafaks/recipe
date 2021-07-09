import express from "express";
import userController from "../controllers/user.controller";

const router = express.Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/logout", userController.logout);

export default router;
