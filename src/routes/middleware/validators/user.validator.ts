import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
export class UserValidator {
  public validateEmail() {
    return body("email").isEmail();
  }

  public validatePassword() {
    return body("password").isLength({ min: 8 });
  }

  public validateUser(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors: Array<Object> = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(400).send({
      errors: extractedErrors,
    });
  }
}

export default new UserValidator();
