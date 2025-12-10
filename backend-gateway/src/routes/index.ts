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
    pathRewrite: {
      '^/api/users': '/api/users',
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
    pathRewrite: {
      '^/api/users': '/api/users',
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
    pathRewrite: {
      '^/api/caisses': '/api/caisses',
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

// Route de santé du gateway
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gateway en ligne',
    timestamp: new Date().toISOString(),
    services: {
      user: config.services.user,
      caisse: config.services.caisse,
    },
  });
});

export default router;
