import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import passportGoogle from 'passport-google-oauth20';
import AuthService from '../services/authservice.js';
import config from './index.js';
import logger from '../util/logger.js';

const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET;

const SetUpPassportAuth = (passport) => {
  passport.use(
    new passportJWT.Strategy(
      {
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.TOKEN_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await AuthService.getUserByUserId(jwt_payload.user_id);
          return done(null, user);
        } catch (error) {
          logger.log('error', 'Error in jwt passport: %O', error);
          return done(null, false, {
            message: 'An error occured while processing your request',
            error: true,
          });
        }
      },
    ),
  );

  passport.use(
    new passportLocal.Strategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const response = await AuthService.getUserForPassportLocalStrategy(
            email,
            password,
          );
          return done(null, response.user, {
            message: response.message,
          });
        } catch (error) {
          return done(null, false, {
            message: 'An error occured while processing your request',
          });
        }
      },
    ),
  );

  passport.use(
    'googleSignup',
    new passportGoogle.Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/signup/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const response =
            await AuthService.getUserForPassportGoogleSignUpStrategy(
              profile.emails?.[0].value,
              profile.name.givenName,
              profile.name.familyName,
            );
          return done(null, response.user, {
            message: response.message,
            error: response.error,
          });
        } catch (error) {
          done(null, undefined, {
            message: 'An error occured while processing your request',
            error: true,
          });
        }
      },
    ),
  );

  passport.use(
    'googleLogin',
    new passportGoogle.Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/login/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const response =
            await AuthService.getUserForPassportGoogleLoginStrategy(
              profile.emails?.[0].value,
            );
          return done(null, response.user, {
            message: response.message,
            error: response.error,
          });
        } catch (error) {
          logger.log('error', 'Error in googleLogin passport: %O', error);
          return done(null, undefined, {
            message: 'An error occured while processing your request',
            error: true,
          });
        }
      },
    ),
  );
};
export default SetUpPassportAuth;
