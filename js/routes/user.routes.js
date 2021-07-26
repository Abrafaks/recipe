"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_1 = require("./middleware/auth");
const user_validator_1 = __importDefault(require("./middleware/validators/user.validator"));
const validator_1 = require("./middleware/validators/validator");
const router = express_1.default.Router();
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
router.post("/register", user_validator_1.default.validateUser(), validator_1.validate, user_controller_1.default.register);
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
router.post("/login", auth_1.auth.authenticate([auth_1.Strategy.Basic]), user_controller_1.default.login);
exports.default = router;
