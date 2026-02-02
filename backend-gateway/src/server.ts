import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './config';
import logger from './utils/logger';
import routes from './routes';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler, notFound } from './middlewares/errorHandler';

const app = express();

// Faire confiance au proxy Railway (nécessaire pour express-rate-limit)
app.set('trust proxy', 1);

// Log de bas niveau pour debugger les requêtes entrantes
app.use((req, res, next) => {
  logger.info(`📥 [DEBUG] Requête reçue: ${req.method} ${req.url}`, {
    ip: req.ip,
    origin: req.get('origin'),
    userAgent: req.get('user-agent')
  });
  next();
});

// Logging en premier pour tout voir
app.use(requestLogger);

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: false, // Désactiver CSP pour le test
}));

// Configuration CORS plus permissive pour le diagnostic
const allowedOrigins = config.cors.origins;
app.use(cors({
  origin: true, // Autoriser toutes les origines pour le diagnostic
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Role', 'X-User-Email'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600, // 10 minutes
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
app.use((req, res, next) => {
  console.log(`[GATEWAY] ${req.method} ${req.url} - Origin: ${req.get('origin')}`);
  next();
});

// Routes API
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Fonction pour démarrer le serveur
const startServer = () => {
  // HTTP Server (fonctionne en mode dev sans redirection)
  const httpServer = http.createServer(app);

  httpServer.listen(config.port, () => {
    logger.info(`🌐 Serveur HTTP démarré sur le port ${config.port}`);
    logger.info(`🔗 URL: http://localhost:${config.port}`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info('Services proxifiés:');
    logger.info(`  👤 User Service: ${config.services.user}`);
    logger.info(`  💰 Caisse Service: ${config.services.caisse}`);
    logger.info(`  🏛️ Backend Legacy: ${config.services.backend}`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

  // HTTPS Server
  try {
    const keyPath = path.resolve(config.ssl.keyPath);
    const certPath = path.resolve(config.ssl.certPath);

    // Vérifier si les certificats existent
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      logger.warn('⚠️  Certificats SSL non trouvés');
      logger.info('Génération de certificats auto-signés...');
      logger.info('Pour la production, utilisez des certificats valides (Let\'s Encrypt, etc.)');
      
      // Pour le développement, on peut continuer sans HTTPS
      // ou générer des certificats auto-signés
      logger.info(`💡 Exécutez: npm run generate-ssl`);
      logger.info(`📡 Le gateway HTTP est disponible sur http://localhost:${config.port}`);
      return;
    }

    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    const httpsServer = https.createServer(httpsOptions, app);

    httpsServer.listen(config.httpsPort, () => {
      logger.info(`🔒 Gateway HTTPS démarré en mode ${config.env}`);
      logger.info(`📡 Écoute sur le port ${config.httpsPort}`);
      logger.info(`🔗 URL: https://localhost:${config.httpsPort}`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info('Services proxifiés:');
      logger.info(`  👤 User Service: ${config.services.user}`);
      logger.info(`  💰 Caisse Service: ${config.services.caisse}`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur HTTPS', { error });
    process.exit(1);
  }
};

// Démarrage
startServer();

export default app;
