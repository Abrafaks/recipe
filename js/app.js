"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_1 = require("./config/swagger");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const recipe_routes_1 = __importDefault(require("./routes/recipe.routes"));
const image_routes_1 = __importDefault(require("./routes/image.routes"));
dotenv_1.default.config();
require("./config/db_config");
const app = express_1.default();
app.set("port", process.env.PORT || 3000);
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
const swaggerSpec = swagger_jsdoc_1.default(swagger_1.swaggerOptions);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use("/auth", user_routes_1.default);
app.use("/recipe", recipe_routes_1.default);
app.use("/image", image_routes_1.default);
app.listen(app.get("port"), () => {
    console.log(`Server is up on port ${app.get("port")}`);
});
exports.default = app;
