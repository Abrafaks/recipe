import dotenv from "dotenv";
import chaiHttp from "chai-http";
import chai from "chai";
import { User } from "../../models/user.model";
import mongoose from "mongoose";
import faker from "faker";

dotenv.config();
process.env.MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/recipe-test";

import app from "../../app";

chai.use(chaiHttp);

export const server = app.listen(app.get("port"), () => {
  console.log(`Server is up on port ${app.get("port")}`);
});

export const close = async function () {
  await User.deleteMany();
  mongoose.connection.close();
  server.close();
};

const email = faker.internet.email();
const password = "NormalPassword6!@#";

export const user = {
  email,
  password,
};
