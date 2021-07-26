"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.Strategy = void 0;
const passport_1 = __importDefault(require("passport"));
const basicStrategy_1 = __importDefault(require("./basicStrategy"));
const jwtStrategy_1 = __importDefault(require("./jwtStrategy"));
var Strategy;
(function (Strategy) {
    Strategy["Basic"] = "basic";
    Strategy["Bearer"] = "bearer";
})(Strategy || (Strategy = {}));
exports.Strategy = Strategy;
passport_1.default.use(Strategy.Bearer, jwtStrategy_1.default);
passport_1.default.use(Strategy.Basic, basicStrategy_1.default);
const auth = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    authenticate: (strategies) => {
        return passport_1.default.authenticate(strategies, { session: false });
    },
};
exports.auth = auth;
