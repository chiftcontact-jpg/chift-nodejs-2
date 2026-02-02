import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import config from '../config';
import { authenticate, authorize } from '../middlewares/auth';
import logger from '../utils/logger';
import authController from '../controllers/authController';

const router = Router();

// ==========================================
// Routes d'authentification (sans middleware auth)
// ==========================================

// Route de santé
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Connexion
router.post('/auth/login', authController.login.bind(authController));

// Inscription
router.post('/auth/register', authController.register.bind(authController));

// Rafraîchir le token
router.post('/auth/refresh-token', authController.refreshToken.bind(authController));

// Déconnexion
router.post('/auth/logout', authController.logout.bind(authController));

// ==========================================
// Routes publiques du user-service
// ==========================================

// Route publique pour définir le mot de passe avec token
router.post(
  '/users/set-password',
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    selfHandleResponse: false,
    pathRewrite: (path, req) => {
      // Si l'URL commence déjà par /api/users, on la garde telle quelle
      // Sinon on ajoute le préfixe /api/users au chemin relatif
      if (req.originalUrl.startsWith('/api/users')) return req.originalUrl;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `/api/users${cleanPath === '/' ? '' : cleanPath}`;
    },
    onProxyReq: (proxyReq, req: any, res) => {
      fixRequestBody(proxyReq, req);
      logger.info('Proxy vers user-service (public)', {
        path: req.path,
        method: req.method,
      });
    },
    onError: (err, req, res) => {
      logger.error('Erreur proxy user-service', {
        error: err.message,
        path: req.url,
      });
      res.status(502).json({
        success: false,
        message: 'Service utilisateur indisponible',
      });
    },
  })
);

// ==========================================
// Routes proxifiées (avec middleware auth)
// ==========================================

// Proxy vers le service utilisateur (routes protégées)
router.use(
  '/users',
  authenticate,
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    selfHandleResponse: false,
    pathRewrite: (path, req) => {
      if (req.originalUrl.startsWith('/api/users')) return req.originalUrl;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `/api/users${cleanPath === '/' ? '' : cleanPath}`;
    },
    onProxyReq: (proxyReq, req: any, res) => {
      // Transférer les informations utilisateur dans les headers AVANT fixRequestBody
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId || '');
        proxyReq.setHeader('X-User-Role', req.user.role || '');
        proxyReq.setHeader('X-User-Email', req.user.email || '');
      }
      
      // Fix body (doit être appelé en dernier)
      fixRequestBody(proxyReq, req);
      
      logger.info('Proxy vers user-service', {
        path: req.path,
        method: req.method,
        target: config.services.user,
      });
    },
    onError: (err, req, res) => {
      logger.error('Erreur proxy user-service', {
        error: err.message,
        path: req.url,
      });
      res.status(502).json({
        success: false,
        message: 'Service utilisateur indisponible',
      });
    },
  })
);

// Proxy vers le service caisse
router.use(
  '/caisses',
  authenticate,
  authorize('ADMIN', 'AGENT', 'MANAGER'),
  createProxyMiddleware({
    target: config.services.caisse,
    changeOrigin: true,
    selfHandleResponse: false,
    pathRewrite: (path, req) => {
      if (req.originalUrl.startsWith('/api/caisses')) return req.originalUrl;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `/api/caisses${cleanPath === '/' ? '' : cleanPath}`;
    },
    onProxyReq: (proxyReq, req: any, res) => {
      // Transférer les informations utilisateur dans les headers AVANT fixRequestBody
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId || '');
        proxyReq.setHeader('X-User-Role', req.user.role || '');
        proxyReq.setHeader('X-User-Email', req.user.email || '');
      }
      
      // Fix body (doit être appelé en dernier)
      fixRequestBody(proxyReq, req);
      
      logger.info('Proxy vers caisse-service', {
        path: req.path,
        method: req.method,
        target: config.services.caisse,
      });
    },
    onError: (err, req, res) => {
      logger.error('Erreur proxy caisse-service', {
        error: err.message,
        path: req.url,
      });
      res.status(502).json({
        success: false,
        message: 'Service caisse indisponible',
      });
    },
  })
);

// Proxy vers le service comptes et services
router.use(
  ['/comptes', '/services'],
  authenticate,
  createProxyMiddleware({
    target: config.services.comptes,
    changeOrigin: true,
    selfHandleResponse: false,
    pathRewrite: (path, req) => {
      if (req.originalUrl.startsWith('/api/comptes')) return req.originalUrl;
      if (req.originalUrl.startsWith('/api/services')) return req.originalUrl;
      const cleanPath = req.originalUrl.startsWith('/api') ? req.originalUrl : `/api${req.originalUrl}`;
      return cleanPath;
    },
    onProxyReq: (proxyReq, req: any, res) => {
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId || '');
        proxyReq.setHeader('X-User-Role', req.user.role || '');
        proxyReq.setHeader('X-User-Email', req.user.email || '');
      }
      fixRequestBody(proxyReq, req);
      logger.info('Proxy vers comptes-service', {
        path: req.path,
        method: req.method,
        target: config.services.comptes,
      });
    },
    onError: (err, req, res) => {
      logger.error('Erreur proxy comptes-service', {
        error: err.message,
        path: req.url,
      });
      res.status(502).json({
        success: false,
        message: 'Service comptes & services indisponible',
      });
    },
  })
);

// Proxy vers le service backend legacy (pour les routes non encore migrées)
const legacyRoutes = ['/utilisateurs', '/souscriptions', '/agents', '/reseaux', '/init'];
router.use(
  legacyRoutes,
  authenticate,
  createProxyMiddleware({
    target: config.services.backend,
    changeOrigin: true,
    selfHandleResponse: false,
    pathRewrite: (path, req) => {
      if (req.originalUrl.startsWith('/api')) return req.originalUrl;
      const cleanPath = req.originalUrl.startsWith('/') ? req.originalUrl : `/${req.originalUrl}`;
      return `/api${cleanPath}`;
    },
    onProxyReq: (proxyReq, req: any, res) => {
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId || '');
        proxyReq.setHeader('X-User-Role', req.user.role || '');
        proxyReq.setHeader('X-User-Email', req.user.email || '');
      }
      fixRequestBody(proxyReq, req);
      logger.info('Proxy vers backend legacy', {
        path: req.path,
        method: req.method,
        target: config.services.backend,
      });
    },
    onError: (err, req, res) => {
      logger.error('Erreur proxy backend legacy', {
        error: err.message,
        path: req.url,
      });
      res.status(502).json({
        success: false,
        message: 'Service backend indisponible',
      });
    },
  })
);

// Route de santé du gateway
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gateway en ligne',
    timestamp: new Date().toISOString(),
    services: {
      user: config.services.user,
      caisse: config.services.caisse,
      backend: config.services.backend,
      comptes: config.services.comptes,
    },
  });
});

export default router;
