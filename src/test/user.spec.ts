import { chai, expect, app, StatusCodes } from "./config/server.config";
import { user } from "./mocks/user.mocks";

describe("User testing", function () {
  describe("Create user", function () {
    it("should create user", async function () {
      const response = await chai
        .request(app)
        .post("/auth/register")
        .set("content-type", "application/json")
        .send({
          email: user.email,
          password: user.password,
        });
      expect(response.error).to.be.false;
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.not.be.null;
    });

    it("should not create user because of invalid email", async function () {
      const response = await chai
        .request(app)
        .post("/auth/register")
        .set("content-type", "application/json")
        .send({
          password: user.password,
        });
      expect(response.body.errors[0].param).to.have.string("email");
      expect(response.body.errors[0].param).to.not.have.string("password");
      expect(response.body.errors[1]).to.not.exist;

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });

    it("should not create user because of invalid password", async function () {
      const response = await chai
        .request(app)
        .post("/auth/register")
        .set("content-type", "application/json")
        .send({
          email: user.email,
        });
      expect(response.body.errors[0].param).to.have.string("password");
      expect(response.body.errors[0].param).to.not.have.string("email");
      expect(response.body.errors[1]).to.not.exist;

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });
  });

  describe("Login user", function () {
    it("should login user", async function () {
      const response = await chai
        .request("http://localhost:3000")
        .post("/auth/login")
        .auth(user.email, user.password);
      expect(response.error).to.be.false;
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.token).to.be.a("string");
    });

    it("should not login user because of invalid email", async function () {
      const response = await chai
        .request("http://localhost:3000")
        .post("/auth/login")
        .auth("em@ai,l", user.password);
      expect(response.body).to.be.an("object").that.is.empty;
      expect(response.text).to.have.string("Unauthorized");
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it("should not login user because of invalid password", async function () {
      const response = await chai
        .request("http://localhost:3000")
        .post("/auth/login")
        .auth(user.email, "someInvalidPassword");
      expect(response.body).to.be.an("object").that.is.empty;
      expect(response.text).to.have.string("Unauthorized");
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
  });
});
