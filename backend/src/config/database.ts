import mongoose from 'mongoose';
import config from './index';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.env === 'test' ? config.mongodb.testUri : config.mongodb.uri;
    
    await mongoose.connect(mongoURI);
    
    logger.info(`MongoDB connecté: ${mongoose.connection.host}`);
    
    mongoose.connection.on('error', (error) => {
      logger.error('Erreur de connexion MongoDB:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB déconnecté');
    });
    
  } catch (error) {
    logger.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
