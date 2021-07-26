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
const user_model_1 = require("../../models/user.model");
const passport_http_1 = require("passport-http");
const user_service_1 = __importDefault(require("../../services/user.service"));
const basicStrategy = new passport_http_1.BasicStrategy((email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (user) {
            const passwordCorrect = yield user_service_1.default.arePasswordsMatching(password, user.passwordHash);
            if (!passwordCorrect) {
                return done(null, false);
            }
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (err) {
        return done(err, false);
    }
}));
exports.default = basicStrategy;
