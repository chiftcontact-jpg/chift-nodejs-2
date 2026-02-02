import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import connectDB from './config/database';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/errorHandler';
import logger from './utils/logger';

const app: Application = express();

// Faire confiance au proxy Railway
app.set('trust proxy', 1);

// Connexion à la base de données
connectDB();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({ 
  origin: true,
  credentials: true
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  logger.info(`📥 [${config.serviceName}] ${req.method} ${req.url}`, {
    origin: req.get('origin'),
    userAgent: req.get('user-agent')
  });
  next();
});

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Route de base
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: config.serviceName,
    message: 'Micro-service de gestion des utilisateurs CHIFT',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      login: '/api/users/login'
    }
  });
});

// Routes API
app.use('/api', routes);

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 ${config.serviceName} démarré en mode ${config.env}`);
  logger.info(`📡 Écoute sur le port ${PORT}`);
  logger.info(`🔗 URL: http://localhost:${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Arrêt du serveur...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM reçu. Arrêt gracieux du serveur...');
  server.close(() => {
    logger.info('💤 Processus terminé!');
  });
});

export default app;
