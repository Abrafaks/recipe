/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT!,
  algorithms: ["HS256"],
};

export default options;
