import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// Routes
router.use('/users', userRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'user-service',
    message: 'Service opérationnel',
    timestamp: new Date().toISOString()
  });
});

export default router;
