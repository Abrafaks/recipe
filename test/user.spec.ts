import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import faker from "faker";
import { User } from "../src/models/user.model";

dotenv.config();
process.env.MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/recipe-test";

import app from "../src/app";

chai.use(chaiHttp);

const server = app.listen(app.get("port"), () => {
  console.log(`Server is up on port ${app.get("port")}`);
});

const email = faker.internet.email();
const password = "NormalPassword6!@#";

after("Close database connection", async function () {
  await User.deleteMany();
  mongoose.connection.close();
  server.close();
});

describe("User testing", function () {
  describe("Create user", function () {
    it("should create user", function (done) {
      console.log(email, password);

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
});
