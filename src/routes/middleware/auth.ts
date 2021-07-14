import passport from "passport";
import { Strategy } from "passport-jwt";
import options from "../../config/passport";
import { User } from "../../models/user.model";

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
