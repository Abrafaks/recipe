import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User, UserDocument } from "../models/user.model";

// UserDocument is raw object from mongodb

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT!,
  algorithms: ["HS256"],
};

const strategy = new Strategy(options, (payload, done) => {
  User.findOne({ _id: payload.userId })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});

passport.use(strategy);
