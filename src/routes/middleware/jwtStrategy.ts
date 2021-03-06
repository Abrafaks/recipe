import { Strategy } from "passport-jwt";
import options from "../../config/passport";
import { User } from "../../models/user.model";

const jwt = new Strategy(options, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.userId, isDeleted: false });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

export default jwt;
