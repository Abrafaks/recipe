import { body } from "express-validator";
export class UserValidator {
  public validateEmail() {
    return body("email").isEmail();
  }

  public validatePassword() {
    return body("password").isLength({ min: 8 });
  }
}

export default new UserValidator();
