import JWT from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../util/logger.js';
import config from '../config/index.js';
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(config.SENDGRID_API_KEY);

const sendSignUpEmail = async (user) => {
  try {
    const token = JWT.sign({ user_id: user.id }, user.encrypted_password);
    await User.updateOne(
      { _id: user._id },
      { confirmation_token: token, confirmation_sent_at: new Date() },
    );

    const link = `${config.CLIENT_URL}/auth/email/confirm#token=${token}`;
    const HTML = `
    <h1>Hello ${user.first_name} ${user.last_name}</h1>
    <p>Click <a href=${link}>here</a> to confirm your email for Cake-o-Mania sign up</p>
    `;
    const msg = {
      from: config.EMAIL_USER,
      to: user.email,
      subject: 'Confirm your email for Cake-o-Mania sign up',
      html: HTML,
    };

    const info = await sendgrid.send(msg);
    logger.log('info', 'emailservice:sendsignupemail %O', info);
  } catch (error) {
    logger.log('error', 'emailservice:sendsignupemail %O', error);
    console.log(error.response.body);
  }
};

const sendPasswordResetEmail = async (user) => {
  try {
    const token = JWT.sign({ user_id: user._id }, user.encrypted_password);
    await User.updateOne(
      { _id: user._id },
      { recovery_token: token, recovery_sent_at: new Date() },
    );
    const link = `${config.CLIENT_URL}/auth/password/reset/change#token=${token}`;
    const HTML = `
    <h1>Hello ${user.first_name} ${user.last_name}</h1>
    <p>Click <a href=${link}>here</a> to reset your email</p>
    `;
    const msg = {
      to: user.email,
      from: config.EMAIL_USER,
      subject: 'Reset your password',
      html: HTML,
    };
    const info = await sendgrid.send(msg);
    logger.log('info', 'emailservice:sendresetpasswordemail %O', info);
  } catch (error) {
    logger.log('error', 'emailservice:sendresetpasswordemail %O', error);
  }
};

export default { sendSignUpEmail, sendPasswordResetEmail };
