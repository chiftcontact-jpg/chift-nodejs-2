import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  serviceName: string;
  mongodb: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  cors: {
    origins: string[];
  };
  logging: {
    level: string;
  };
  apiGateway: {
    url: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3050', 10),
  serviceName: process.env.SERVICE_NAME || 'user-service',
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chift'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'votre_secret_jwt_user_service',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'votre_secret_refresh_jwt_user_service',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },
  
  cors: {
    origins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3046']
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  
  apiGateway: {
    url: process.env.API_GATEWAY_URL || 'http://localhost:3045'
  }
};

export default config;
