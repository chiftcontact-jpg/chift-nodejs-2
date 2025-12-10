import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  mongodb: {
    uri: string;
    testUri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  cors: {
    origin: string;
  };
  logging: {
    level: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chift',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/chift_test'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'votre_secret_refresh_jwt',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

export default config;
