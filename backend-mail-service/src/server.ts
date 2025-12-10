import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config';
import logger from './utils/logger';
import routes from './routes';

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/mail', routes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

// Gestion des erreurs globales
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Erreur serveur:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
  });
});

// Démarrage du serveur
app.listen(config.port, () => {
  logger.info(`🚀 Mail Service démarré en mode ${config.nodeEnv}`);
  logger.info(`📡 Écoute sur le port ${config.port}`);
  logger.info(`🔗 URL: http://localhost:${config.port}`);
  logger.info(`📧 SMTP: ${config.smtp.host}:${config.smtp.port}`);
});

export default app;
