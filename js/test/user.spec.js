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
const server_config_1 = require("./config/server.config");
const user_mocks_1 = require("./mocks/user.mocks");
beforeEach("Add user and get token", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_mocks_1.createUser();
    });
});
afterEach("Delete all users", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield user_mocks_1.deleteAllUsers();
    });
});
describe("User testing", function () {
    describe("Create user", function () {
        it("should create user", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/auth/register")
                    .set("content-type", "application/json")
                    .send({
                    email: user_mocks_1.user.email,
                    password: user_mocks_1.user.password,
                });
                server_config_1.expect(response.error).to.be.false;
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body).to.not.be.null;
            });
        });
        it("should not create user because of missing email", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/auth/register")
                    .set("content-type", "application/json")
                    .send({
                    password: user_mocks_1.user.password,
                });
                server_config_1.expect(response.body.errors[0].param).to.have.string("email");
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
            });
        });
        it("should not create user because of missing password", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/auth/register")
                    .set("content-type", "application/json")
                    .send({
                    email: user_mocks_1.user.email,
                });
                server_config_1.expect(response.body.errors[0].param).to.have.string("password");
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.BAD_REQUEST);
            });
        });
    });
    describe("Login user", function () {
        it("should login user", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/auth/login")
                    .auth(user_mocks_1.finalUser.email, user_mocks_1.finalUser.password);
                server_config_1.expect(response.error).to.be.false;
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.OK);
                server_config_1.expect(response.body.token).to.be.a("string");
            });
        });
        it("should not login user because of invalid email", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/auth/login")
                    .auth("em@ai,l", user_mocks_1.finalUser.password);
                server_config_1.expect(response.body).to.be.an("object").that.is.empty;
                server_config_1.expect(response.text).to.have.string("Unauthorized");
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.UNAUTHORIZED);
            });
        });
        it("should not login user because of invalid password", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield server_config_1.chai
                    .request(server_config_1.app)
                    .post("/auth/login")
                    .auth(user_mocks_1.finalUser.email, "someInvalidPassword");
                server_config_1.expect(response.body).to.be.an("object").that.is.empty;
                server_config_1.expect(response.text).to.have.string("Unauthorized");
                server_config_1.expect(response).to.have.status(server_config_1.StatusCodes.UNAUTHORIZED);
            });
        });
    });
});
