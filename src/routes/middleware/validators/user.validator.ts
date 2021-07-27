import { body, ValidationChain } from "express-validator";

const email = body("email")
  .isEmail({ allow_utf8_local_part: false })
  .withMessage("Invalid email");
const password = body("password")
  .isStrongPassword()
  .withMessage(
    "Password must have minimum length of 8 and contain at least 1 lowercase, 1 uppercase character, 1 symbol and 1 number"
  );

export class UserValidator {
  public validateUser(): ValidationChain[] {
    return [email, password];
  }
}

export default new UserValidator();
