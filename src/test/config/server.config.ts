import dotenv from "dotenv";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import faker from "faker";
import { User } from "../../models/user.model";
import { Recipe } from "../../models/recipe.model";
dotenv.config();
process.env.MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/recipe-test";

import app from "../../app";

chai.use(chaiHttp);

export { chai, expect, mongoose, User, Recipe, faker, app, StatusCodes };
