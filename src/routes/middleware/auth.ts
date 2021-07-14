import passport from "passport";
import basicStrategy from "./basicStrategy";
import jwt from "./jwtStrategy";

passport.use(jwt);
passport.use(basicStrategy);
