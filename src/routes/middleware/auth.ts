import passport from "passport";
import basicStrategy from "./basicStrategy";
import jwt from "./jwtStrategy";

enum Strategy {
  Basic = "basic",
  Bearer = "bearer",
}

passport.use(Strategy.Bearer, jwt);
passport.use(Strategy.Basic, basicStrategy);

const auth = {
  authenticate: (strategies: Array<Strategy>) => {
    return passport.authenticate(strategies, { session: false });
  },
};

export { Strategy, auth };
