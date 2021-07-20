import chai, { expect } from "chai";
import mongoose from "mongoose";
import faker from "faker";
import { User } from "../models/user.model";
import { server, close } from "./config/server.config";

const email = faker.internet.email();
const password = "NormalPassword6!@#";

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
          email,
          password,
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
        .auth(email, password)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.token).to.be.a("string");
          done();
        });
    });
  });
});
