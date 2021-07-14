import passport from "passport";
import { ExtractJwt } from "passport-jwt";
import { User } from "../models/user.model";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT!,
  algorithms: ["HS256"],
};

export default options;
