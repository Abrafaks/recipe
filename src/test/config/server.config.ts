import dotenv from "dotenv";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import faker from "faker";
import sinon from "sinon";
import { User } from "../../models/user.model";
import { Recipe, RecipeDocument } from "../../models/recipe.model";
import { Webhook } from "../../models/webhook.model";
import jwt from "jsonwebtoken";
dotenv.config();
process.env.MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/recipe-test";

import app from "../../index";

chai.use(chaiHttp);

export {
  chai,
  expect,
  sinon,
  mongoose,
  Webhook,
  User,
  Recipe,
  RecipeDocument,
  faker,
  app,
  StatusCodes,
  jwt,
};
