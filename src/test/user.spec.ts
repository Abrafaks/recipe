import chai, { expect } from "chai";
import { close, user } from "./config/server.config";

after("Close database connection", async function () {
  await close();
});

describe("User testing", function () {
  describe("Create user", function () {
    it("should create user", function (done) {
      const requester = chai
        .request("http://localhost:3000")
        .post("/auth/register")
        .set("content-type", "application/json")
        .send({
          email: user.email,
          password: user.password,
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("Login user", function () {
    it("should login user", function (done) {
      const requester = chai
        .request("http://localhost:3000")
        .post("/auth/login")
        .auth(user.email, user.password)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.token).to.be.a("string");
          done();
        });
    });
  });
});
