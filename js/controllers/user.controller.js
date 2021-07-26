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
exports.UserController = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, isAdmin } = req.user;
                const token = user_service_1.default.createToken(_id, isAdmin);
                return res.send({ token });
            }
            catch (err) {
                return res.status(500).send();
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const existingUser = yield user_service_1.default.getUserByEmail(email);
                if (existingUser) {
                    return res
                        .status(400)
                        .json({ errorMessage: "Account with this email already exists." });
                }
                return res.send(yield user_service_1.default.createUserAndReturnToken(email, password));
            }
            catch (err) {
                return res.status(500).send();
            }
        });
    }
}
exports.UserController = UserController;
exports.default = new UserController(user_service_1.default);
