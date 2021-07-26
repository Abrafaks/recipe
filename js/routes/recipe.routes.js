"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipe_controller_1 = __importDefault(require("../controllers/recipe.controller"));
const auth_1 = require("./middleware/auth");
const recipe_validator_1 = __importDefault(require("./middleware/validators/recipe.validator"));
const validator_1 = require("./middleware/validators/validator");
const router = express_1.default.Router();
/**
 * @swagger
 * /recipe/:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - recipe
 *     description: Create recipe
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: recipe
 *         schema:
 *           $ref: '#components/schemas/Recipe'
 *
 *     responses:
 *       200:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth_1.auth.authenticate([auth_1.Strategy.Bearer]), recipe_validator_1.default.validateCreateRecipeData(), validator_1.validate, recipe_controller_1.default.createRecipe);
/**
 * @swagger
 * /recipe/:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - recipe
 *     description: Read all recipes. limit, skip, name are optional. Used for pagination and searching
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of recipes to search for
 *         example: Cookies
 *       - in: query
 *         name: limit
 *         schema:
 *           type: int
 *         description: How many recipes to display
 *         example: 10
 *       - in: query
 *         name: skip
 *         schema:
 *           type: int
 *         description: How many recipes to skip
 *         example: 20
 *
 *     responses:
 *       200:
 *         description: Recipe read successfully. If no recipe is found, empty array will be returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth_1.auth.authenticate([auth_1.Strategy.Bearer]), recipe_validator_1.default.validateGetRecipeList(), validator_1.validate, recipe_controller_1.default.getRecipeList);
/**
 * @swagger
 * /recipe/:id:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - recipe
 *     description: Read recipe by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of recipe for reading
 *         example: 60f7ea20cf60ae0004307aa2
 *
 *     responses:
 *       200:
 *         description: Recipe read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/RecipeDocument'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", auth_1.auth.authenticate([auth_1.Strategy.Bearer]), recipe_validator_1.default.validateReadRecipeById(), validator_1.validate, recipe_controller_1.default.readRecipeById);
/**
 * @swagger
 * /recipe/:id:
 *   put:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - recipe
 *     description: Update recipe. All fields are optional
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: recipe
 *         schema:
 *           $ref: '#components/schemas/Recipe'
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Id of recipe to update
 *         example: 60f7ea20cf60ae0004307aa2
 *
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", auth_1.auth.authenticate([auth_1.Strategy.Bearer]), recipe_validator_1.default.validateUpdateRecipeData(), validator_1.validate, recipe_controller_1.default.updateRecipe);
exports.default = router;
