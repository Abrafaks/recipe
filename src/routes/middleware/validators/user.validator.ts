import { body, ValidationChain } from "express-validator";

const email = body("email").isEmail();
const password = body("password").isStrongPassword();

export class UserValidator {
  public validateUser(): ValidationChain[] {
    return [email, password];
  }
}

export default new UserValidator();
