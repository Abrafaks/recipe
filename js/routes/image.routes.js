"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const image_controller_1 = __importDefault(require("../controllers/image.controller"));
const auth_1 = require("./middleware/auth");
const image_validator_1 = __importStar(require("./middleware/validators/image.validator"));
const validator_1 = require("./middleware/validators/validator");
const router = express_1.default.Router();
/**
 * @swagger
 * /image/:id:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - image
 *     description: Read all recipe images
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7ea20cf60ae0004307aa2
 *         description: Id of post
 *
 *     responses:
 *       200:
 *         description: Found images
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/ImageDocument'
 *       400:
 *         description: No images found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", image_validator_1.default.validateReadRecipeImagesData(), validator_1.validate, image_controller_1.default.readRecipeImages);
/**
 * @swagger
 * /image/:id:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - image
 *     description: Add image
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7ea20cf60ae0004307aa2
 *         description: Id of post
 *       - in: form-data
 *         name: image
 *         schema:
 *           type: Buffer
 *           example:  |
 *             <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44
 *             52 00 00 04 18 00 00 00 ca 08 06 00 00 00 0f 58 f3 5e
 *             00 00 18 86 69 43 43 50 49 43 43 20 50 72 6f 66 69
 *             ... 115777 more bytes>
 *         description: Image buffer
 *
 *     responses:
 *       201:
 *         description: Image added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/:id", auth_1.auth.authenticate([auth_1.Strategy.Bearer]), image_validator_1.upload.single("image"), image_validator_1.default.validateAddImageData(), validator_1.validate, image_controller_1.default.addImage);
/**
 * @swagger
 * /image/:id:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - image
 *     description: Delete image
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7ea20cf60ae0004307aa2
 *         description: Id of post
 *
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", auth_1.auth.authenticate([auth_1.Strategy.Bearer]), image_validator_1.default.validateDeleteRecipeByIdData(), validator_1.validate, image_controller_1.default.deleteImageById);
exports.default = router;
