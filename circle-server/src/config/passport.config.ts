import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.CLIENT_URL}/user/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        fullname: profile.displayName,
        email: profile.emails?.[0].value,
        avatar: profile.photos?.[0].value,
      };

      return done(null, user);
    }
  )
);

export default passport;