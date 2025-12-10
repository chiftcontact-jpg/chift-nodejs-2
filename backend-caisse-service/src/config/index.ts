import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3051', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chift',
  jwt: {
    secret: process.env.JWT_SECRET || 'chift_caisse_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'chift_caisse_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  }
};

export default config;
