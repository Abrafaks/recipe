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
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalUser = exports.createUser = exports.deleteAllUsers = exports.getToken = exports.user = void 0;
const server_config_1 = require("../config/server.config");
let email = server_config_1.faker.internet.email();
let password = "NormalPassword6!@#";
const user = {
    email,
    password,
};
exports.user = user;
email = "c@d.com";
const recipeUser = {
    email,
    passwordHash: "$2b$10$qaVKnj8yjoXkcrQ3GKXhYOcNVNZKvj46PfNp1LnlD7JP5hrBVXWJW",
};
const finalUser = {
    email,
    password: "Password1!",
};
exports.finalUser = finalUser;
const createUser = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return new server_config_1.User(recipeUser).save();
    });
};
exports.createUser = createUser;
const getToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield createUser();
        const { _id, isAdmin } = user;
        const userId = _id;
        const token = server_config_1.jwt.sign({
            userId,
            isAdmin,
        }, process.env.JWT);
        return { token, userId };
    });
};
exports.getToken = getToken;
const deleteAllUsers = function () {
    return server_config_1.User.deleteMany();
};
exports.deleteAllUsers = deleteAllUsers;
