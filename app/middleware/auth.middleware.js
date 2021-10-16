import passport from 'passport';
import logger from '../util/logger.js';

const authCheckMiddleware = (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false },
    function (err, user, message) {
      if (err || !user) {
        return res.status(401).json({
          message: message?.message || 'You are not authenticated',
          error: true,
        });
      }
      req.logIn(user, { session: false }, function (err) {
        if (err) {
          logger.log('error', 'authmiddleware:authcheckmiddleware %O', err);
          return res.status(401).json({
            message: 'You are not authenticated',
            error: true,
          });
        }
        return next();
      });
    },
  )(req, res, next);
};

export default { authCheckMiddleware };
