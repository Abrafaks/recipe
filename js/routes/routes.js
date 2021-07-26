"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./user.routes"));
const recipe_routes_1 = __importDefault(require("./recipe.routes"));
const image_routes_1 = __importDefault(require("./image.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_1 = require("../config/swagger");
const app = express_1.default();
const swaggerSpec = swagger_jsdoc_1.default(swagger_1.swaggerOptions);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use("/auth", user_routes_1.default);
app.use("/recipe", recipe_routes_1.default);
app.use("/image", image_routes_1.default);
app.use("*", (req, res) => {
    res.status(404).send("Page not found.");
});
exports.default = app;
