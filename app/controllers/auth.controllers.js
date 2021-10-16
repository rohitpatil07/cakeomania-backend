import passport from 'passport';
import AuthService from '../services/authservice.js';
import logger from '../util/logger.js';
import config from '../config/index.js';

const loginWithEmailPassword = (req, res) => {
  passport.authenticate(
    'local',
    { session: false },
    function (err, user, message) {
      if (err || !user) {
        return res.status(401).json({ ...message, error: true });
      }
      req.logIn(user, { session: false }, async function (err) {
        if (err) {
          logger.log('error', 'userservice:loginwithemailpassword %O', err);
          return res
            .status(401)
            .json({ message: 'Failed to log you in', error: true });
        }
        const token = AuthService.generateAuthToken(user);
        const refreshToken = await AuthService.generateAndWriteRefreshToken(
          user,
        );

        res.cookie('refreshToken', refreshToken, {
          maxAge:
            1000 * 60 * 60 * 24 * parseInt(config.REFRESH_TOKEN_VALIDITY_DAYS),
          httpOnly: true,
        });
        return res.status(200).json({ ...message, error: false, token: token });
      });
    },
  )(req, res);
};

const signUpWithEmailPassword = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNo, password } = req.body;

    if (!firstName || !lastName || !email || !mobileNo || !password)
      return res.status(422).json({
        error: true,
        message:
          'Please provide all five of firstName, lastName, email, mobileNo and password',
      });

    const response = await AuthService.signUpWithEmailPassword(
      firstName,
      lastName,
      email,
      mobileNo,
      password,
    );

    return res.status(response.error ? 401 : 200).json(response);
  } catch (error) {
    logger.log('error', 'authcontroller:signupwithemailpassword %O', error);
    return res.json({
      error: true,
      message: 'An error occured while processing your request',
    });
  }
};

const verifySignUpEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res
        .status(401)
        .json({ message: 'No token provided', error: true });
    const response = await AuthService.verifySignUpEmail(token);
    return res.status(response.error ? 401 : 200).json(response);
  } catch (error) {
    logger.log('error', 'userservice:verifysignupemail  %O', error);
    return res.status(401).json({
      message: 'An error occured while processing your request',
      error: true,
    });
  }
};

const logout = (req, res) => {
  req.logOut();
  // Remove the refresh_token
  res.cookie('refreshToken', '', {
    httpOnly: true,
  });

  res.json({ message: 'Logged out successfully' });
};

const verify = (req, res) => {
  if (req.user)
    return res
      .json({
        message: 'You are authenticated',
        isAuthenticated: true,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        error: false,
      })
      .status(200);
  else
    return res.status(401).json({
      message: 'You are not authenticated',
      isAuthenticated: false,
      error: false,
    });
};

const googleSignUpCallback = (req, res) => {
  passport.authenticate('googleSignup', {}, async (err, user, message) => {
    if (err || !user) {
      const encodedMessage = encodeURIComponent(message.message);
      return res.redirect(
        `${config.CLIENT_URL}/auth/google/callback/signup/failed#message=${encodedMessage}`,
      );
    }
    const token = AuthService.generateAuthToken(user);
    const refreshToken = await AuthService.generateAndWriteRefreshToken(user);
    const encodedMessage = encodeURIComponent(message.message);
    res.cookie('refreshToken', refreshToken, {
      maxAge:
        1000 * 60 * 60 * 24 * parseInt(config.REFRESH_TOKEN_VALIDITY_DAYS),
      httpOnly: true,
    });
    return res.redirect(
      `${config.CLIENT_URL}/auth/google/callback/signup/success#token=${token}#message=${encodedMessage}`,
    );
  })(req, res);
};

const googleLoginCallback = (req, res) => {
  passport.authenticate('googleLogin', {}, (err, user, message) => {
    if (err || !user) {
      const encodedMessage = encodeURIComponent(message.message);
      return res.redirect(
        `${config.CLIENT_URL}/auth/google/callback/login/failed#message=${encodedMessage}`,
      );
    }
    req.logIn(user, { session: false }, async function (err) {
      if (err) {
        const encodedMessage = encodeURIComponent('Failed to log you in');
        return res.redirect(
          `${config.CLIENT_URL}/auth/google/callback/login/failed#message=${encodedMessage}`,
        );
      }
      const token = AuthService.generateAuthToken(user);
      const refreshToken = await AuthService.generateAndWriteRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        maxAge:
          1000 * 60 * 60 * 24 * parseInt(config.REFRESH_TOKEN_VALIDITY_DAYS),
        httpOnly: true,
      });
      return res.redirect(
        `${config.CLIENT_URL}/auth/google/callback/login/success#token=${token}`,
      );
    });
  })(req, res);
};

const refreshTokenForUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res
      .status(401)
      .json({ message: 'No refresh token found', error: true });
  const response = await AuthService.refreshTokenForUser(refreshToken);
  if (response.error) return res.status(401).json(response);
  res.cookie('refreshToken', response.refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * parseInt(config.REFRESH_TOKEN_VALIDITY_DAYS),
    httpOnly: true,
    // sameSite: 'none',
    // secure: true,
  });
  delete response.refreshToken;
  return res.json(response);
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(401)
        .json({ message: 'No email provided', error: true });
    const response = await AuthService.sendResetPasswordMail(email);
    return res.json({ message: response.message, error: response.error });
  } catch (error) {
    logger.log('error', 'authcontroller:sendpasswordresetemail  %O', error);
    return res.status(401).json({
      message: 'An error occured while processing your request',
      error: true,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(401).json({
        message: 'Token and password is required',
        error: true,
      });
    if (password.length < 6)
      return res.status(401).json({
        message: 'Password should have length of atleast 6',
        error: true,
      });
    const response = await AuthService.resetPassword(token, password);
    return res.status(response.error ? 401 : 200).json(response);
  } catch (error) {
    logger.log('error', 'authcontroller:resetpassword %O', error);
    return res.json({
      message: 'An error occured while processing your request',
      error: true,
    });
  }
};

export default {
  loginWithEmailPassword,
  signUpWithEmailPassword,
  googleLoginCallback,
  googleSignUpCallback,
  logout,
  refreshTokenForUser,
  verify,
  verifySignUpEmail,
  sendPasswordResetEmail,
  resetPassword,
};
