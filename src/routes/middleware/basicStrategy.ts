import { User } from "../../models/user.model";
import { BasicStrategy } from "passport-http";
import userService from "../../services/user.service";

const basicStrategy = new BasicStrategy(async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      const passwordCorrect = await userService.arePasswordsMatching(
        password,
        user.passwordHash
      );
      if (!passwordCorrect) {
        throw new Error("Invalid credentials.");
      }
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    return done(err, null);
  }
});

export default basicStrategy;
