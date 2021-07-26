"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValidator = exports.upload = void 0;
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
exports.upload = multer_1.default({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error("Please upload png, jpeg or jpg."));
        }
        cb(null, true);
    },
});
const id = express_validator_1.param("id")
    .notEmpty()
    .withMessage("Id must not be empty")
    .isMongoId()
    .withMessage("Id must be valid mongodb id");
const image = express_validator_1.check("buffer").custom((value, { req }) => {
    if (req.file.buffer) {
        return true;
    }
});
class ImageValidator {
    validateAddImageData() {
        return [id, image];
    }
    validateReadRecipeImagesData() {
        return id;
    }
    validateDeleteRecipeByIdData() {
        return id;
    }
}
exports.ImageValidator = ImageValidator;
exports.default = new ImageValidator();
