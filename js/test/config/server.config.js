"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = exports.StatusCodes = exports.app = exports.faker = exports.Recipe = exports.User = exports.mongoose = exports.expect = exports.chai = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const chai_http_1 = __importDefault(require("chai-http"));
const chai_1 = __importStar(require("chai"));
exports.chai = chai_1.default;
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return chai_1.expect; } });
const http_status_codes_1 = require("http-status-codes");
Object.defineProperty(exports, "StatusCodes", { enumerable: true, get: function () { return http_status_codes_1.StatusCodes; } });
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
const faker_1 = __importDefault(require("faker"));
exports.faker = faker_1.default;
const user_model_1 = require("../../models/user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const recipe_model_1 = require("../../models/recipe.model");
Object.defineProperty(exports, "Recipe", { enumerable: true, get: function () { return recipe_model_1.Recipe; } });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.jwt = jsonwebtoken_1.default;
dotenv_1.default.config();
process.env.MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/recipe-test";
const app_1 = __importDefault(require("../../app"));
exports.app = app_1.default;
chai_1.default.use(chai_http_1.default);
