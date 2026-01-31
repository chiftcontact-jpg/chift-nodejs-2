import express from 'express';
import caisseRoutes from './caisseRoutes';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'caisse-service',
    message: 'Service opérationnel',
    timestamp: new Date().toISOString()
  });
});

router.use('/caisses', caisseRoutes);

export default router;
