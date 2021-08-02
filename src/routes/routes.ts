import express, { Request, Response, Router } from "express";
import userRoutes from "./user.routes";
import recipeRoutes from "./recipe.routes";
import imageRoutes from "./image.routes";
import webhookRoutes from "./webhook.routes";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "../config/swagger";

const router: Router = express.Router();

const swaggerSpec = swaggerJSDoc(swaggerOptions);

router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
router.use("/auth", userRoutes);
router.use("/recipe", recipeRoutes);
router.use("/images", imageRoutes);
router.use("/webhooks", webhookRoutes);
router.use("*", (req: Request, res: Response) => {
  res.status(404).send("Page not found.");
});

export default router;
