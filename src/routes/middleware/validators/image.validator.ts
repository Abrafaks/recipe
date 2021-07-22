import { check, param, ValidationChain } from "express-validator";
import multer from "multer";

export const upload = multer({
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

const id = param("id")
  .notEmpty()
  .withMessage("Id must not be empty")
  .isMongoId()
  .withMessage("Id must be valid mongodb id");

const image = check("buffer").custom((value, { req }) => {
  if (req.file.buffer) {
    return true;
  }
});

export class ImageValidator {
  public validateAddImageData(): ValidationChain[] {
    return [id, image];
  }
  public validateReadRecipeImagesData(): ValidationChain {
    return id;
  }
  public validateDeleteRecipeByIdData(): ValidationChain {
    return id;
  }
}

export default new ImageValidator();
