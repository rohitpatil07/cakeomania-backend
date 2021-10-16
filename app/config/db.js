import mongoose from 'mongoose';
import logger from '../util/logger.js';
import config from './index.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.log('error', 'db: %O', err);
    process.exit(1);
  }
};

export default connectDB;
