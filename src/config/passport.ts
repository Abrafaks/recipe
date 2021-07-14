import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/user.model";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT!,
  algorithms: ["HS256"],
};

const strategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.userId });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(strategy);
