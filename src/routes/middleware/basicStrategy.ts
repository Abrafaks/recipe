import { User } from "../../models/user.model";
import { BasicStrategy } from "passport-http";
import userService from "../../services/user.service";

const basicStrategy = new BasicStrategy(async (email, password, done) => {
  try {
    console.log("start", email, password);
    const user = await User.findOne({ email });
    if (user) {
      console.log("There is a user", user);

      const passwordCorrect = await userService.arePasswordsMatching(
        password,
        user.passwordHash
      );

      if (!passwordCorrect) {
        throw new Error("Invalid credentials.");
      }

      done(null, user);
    } else {
      console.log("There is no user");

      done(null, false);
    }
  } catch (err) {
    console.log("BS ERROR ", err);
    return done(err, null);
  }
});

export default basicStrategy;
