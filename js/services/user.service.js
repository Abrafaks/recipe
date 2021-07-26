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
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const rounds = 10;
class UserService {
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.User.findOne({ email });
        });
    }
    hashPassword(password, rounds) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.hash(password, rounds);
        });
    }
    createUser(email, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new user_model_1.User({ email, passwordHash });
            return user.save();
        });
    }
    createToken(userId, isAdmin) {
        return jsonwebtoken_1.default.sign({
            userId,
            isAdmin,
        }, process.env.JWT);
    }
    createUserAndReturnToken(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield this.hashPassword(password, rounds);
            const savedUser = yield this.createUser(email, passwordHash);
            return savedUser;
        });
    }
    arePasswordsMatching(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(password, hash);
        });
    }
}
exports.UserService = UserService;
exports.default = new UserService();
