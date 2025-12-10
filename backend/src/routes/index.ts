import { Router } from 'express';
import adherentRoutes from './adherentRoutes';
import souscriptionRoutes from './souscriptionRoutes';
import authRoutes from './authRoutes';
import agentRoutes from './agentRoutes';
import caisseRoutes from './caisseRoutes';
import reseauRoutes from './reseauRoutes';
import initRoutes from './initRoutes';

const router = Router();

// Routes principales
router.use('/auth', authRoutes);
router.use('/adherents', adherentRoutes);
router.use('/souscriptions', souscriptionRoutes);
router.use('/agents', agentRoutes);
router.use('/caisses', caisseRoutes);
router.use('/reseaux', reseauRoutes);
router.use('/init', initRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API CHIFT opérationnelle',
    timestamp: new Date().toISOString()
  });
});

export default router;
