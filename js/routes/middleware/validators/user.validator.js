"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const express_validator_1 = require("express-validator");
const email = express_validator_1.body("email").isEmail().withMessage("Invalid email");
const password = express_validator_1.body("password")
    .isStrongPassword()
    .withMessage("Password must have minimum length of 8 and contain at least 1 lowercase, 1 uppercase character, 1 symbol and 1 number");
class UserValidator {
    validateUser() {
        return [email, password];
    }
}
exports.UserValidator = UserValidator;
exports.default = new UserValidator();
