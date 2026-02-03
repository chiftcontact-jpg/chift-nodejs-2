import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  httpsPort: number;
  jwtSecret: string;
  services: {
    user: string;
    caisse: string;
    backend: string;
    comptes: string;
    mail: string;
  };
  ssl: {
    keyPath: string;
    certPath: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origins: string[];
  };
  logging: {
    level: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  httpsPort: parseInt(process.env.HTTPS_PORT || '3443', 10),
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  services: {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3050',
    caisse: process.env.CAISSE_SERVICE_URL || 'http://localhost:3051',
    backend: process.env.BACKEND_URL || 'http://localhost:3045',
    comptes: process.env.COMPTES_SERVICE_URL || 'http://localhost:3053',
    mail: process.env.MAIL_SERVICE_URL || 'http://localhost:3052',
  },
  ssl: {
    keyPath: process.env.SSL_KEY_PATH || './ssl/key.pem',
    certPath: process.env.SSL_CERT_PATH || './ssl/cert.pem',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  cors: {
    origins: (process.env.CORS_ORIGIN || 'http://192.168.1.21:3046,http://localhost:3046,https://frontend-ieq4toj2k-inssatoures-projects.vercel.app').split(','),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};

export default config;
