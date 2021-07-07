import express from "express";
import * as user_controller from "../controllers/user.controller";

const router = express.Router();

router.post("/register", user_controller.register);

router.post("/login", user_controller.login);

router.get("/logout", user_controller.logout);

export default router;
