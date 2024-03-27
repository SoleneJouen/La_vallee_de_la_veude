import passport from "passport";
import { Strategy } from "passport-jwt";

let cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) token = req.cookies["jwt"];
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(opts, (jwt_payload, done) => {
    if (jwt_payload.user) {
      return done(null, jwt_payload.user);
    }

    return done(null, false);
  })
);