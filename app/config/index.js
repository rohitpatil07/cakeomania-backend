import dotenv from 'dotenv';

dotenv.config();

export default {
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  SESSION_SECRET:
    process.env.SESSION_SECRET ||
    'asdufjuhtaewr98yh43noikgvrfa98y436890vfhnojihnga9-',
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URL: process.env.MONGO_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SOCKET_TOKEN_SECRET:
    process.env.SOCKET_TOKEN_SECRET || 'ljkhsaduhntolika89yvsdnlke480',
  TOKEN_VALIDITY_MINUTES: process.env.TOKEN_VALIDITY_MINUTES || '15',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'aohg08neorh8094nyoirgaehol',
  REFRESH_TOKEN_VALIDITY_DAYS: process.env.REFRESH_TOKEN_VALIDITY_DAYS || '2',
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || 'asdjfuioh809jh2yionaer89nvadsol',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
};
