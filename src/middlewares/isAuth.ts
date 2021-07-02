// MiddleWare
import { Request } from "express";
import { Strategy as JWTStrategy, VerifiedCallback } from "passport-jwt";
import passport from "passport";
import User from "../models/User";

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["auth_token"];
  }
  return token;
};

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: `${process.env.SECRET}`,
    },
    async (payload, done: VerifiedCallback) => {
      try {
        const user = await User.findById(payload.sub);

        if (user) {
          return done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
