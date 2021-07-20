import dotenv from "dotenv";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import { StatusCodes } from "http-status-codes";

dotenv.config();
process.env.MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/recipe-test";

import app from "../../app";

chai.use(chaiHttp);

export { chai, expect, app, StatusCodes };
