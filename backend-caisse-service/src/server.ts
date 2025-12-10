import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/database';
import routes from './routes';
import logger from './utils/logger';
import { config } from './config';

const app: Application = express();

// Middleware CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3046', 'http://localhost:3047', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Role', 'X-User-Email'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Caisse Service en ligne',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée - ${req.method} ${req.path}`
  });
});

// Error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erreur serveur:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur'
  });
});

// Connexion DB et démarrage serveur
connectDB().then(() => {
  app.listen(config.port, () => {
    logger.info(`🚀 caisse-service démarré en mode ${config.env}`);
    logger.info(`📡 Écoute sur le port ${config.port}`);
    logger.info(`🔗 URL: http://localhost:${config.port}`);
    
    console.log(`🚀 caisse-service démarré en mode ${config.env}`);
    console.log(`📡 Écoute sur le port ${config.port}`);
    console.log(`🔗 URL: http://localhost:${config.port}`);
  });
});

export default app;
