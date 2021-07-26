"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const image_service_1 = __importDefault(require("../services/image.service"));
const sharp_1 = __importDefault(require("sharp"));
const express_validator_1 = require("express-validator");
class ImageController {
    constructor(imageService) {
        this.imageService = imageService;
    }
    addImage(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, isAdmin } = req.user;
                const recipeId = express_validator_1.matchedData(req).id;
                const image = yield sharp_1.default((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer)
                    .resize({ width: 250, height: 250 })
                    .png()
                    .toBuffer();
                const savedImage = yield image_service_1.default.addRecipeImage(recipeId, image, _id, isAdmin);
                if (savedImage) {
                    return res.status(201).send();
                }
                return res.status(400).send({ savedImage });
            }
            catch (err) {
                console.log(err);
                return res.status(500).send();
            }
        });
    }
    readRecipeImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = express_validator_1.matchedData(req);
                const images = yield image_service_1.default.readRecipeImages(id);
                if (images) {
                    return res.send({ images });
                }
                return res.status(400).send();
            }
            catch (err) {
                return res.status(500).send();
            }
        });
    }
    deleteImageById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, isAdmin } = req.user;
                const { id } = express_validator_1.matchedData(req);
                const deletedImage = yield image_service_1.default.deleteImageById(id, _id, isAdmin);
                if (!deletedImage) {
                    return res.status(400).send();
                }
                return res.send();
            }
            catch (err) {
                return res.status(500).send();
            }
        });
    }
}
exports.ImageController = ImageController;
exports.default = new ImageController(image_service_1.default);
