import mongoose from 'mongoose';
import { config } from './index';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`✅ MongoDB connecté: ${conn.connection.host}`);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error('❌ Erreur connexion MongoDB:', error);
    console.error('❌ Erreur connexion MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;