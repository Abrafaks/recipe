import { expect } from "chai";
import mongoose from "mongoose";
import dotenv from "dotenv";
import faker from "faker";
import { User } from "../src/models/user.model";

const user = new User({
  email: faker.name.findName(),
  passwordHash: faker.internet.password(),
});

dotenv.config();

before("Connect to database", async function () {
  process.env.MONGODB_CONNECTION_STRING =
    "mongodb://localhost:27017/recipe-test";
  await mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) throw err;
      console.log("MongoDB connection established");
    }
  );
});

beforeEach(async function () {
  await user.save();
});

afterEach(async function () {
  await User.deleteOne({ email: user.email });
});

after("Close database connection", function () {
  mongoose.connection.close();
});

describe("Just testing", function () {
  describe("Nested testing", function () {
    it("is supposed to work", function () {
      const sum = 2 + 3;
      expect(sum).to.equal(5);
    });
  });
});
