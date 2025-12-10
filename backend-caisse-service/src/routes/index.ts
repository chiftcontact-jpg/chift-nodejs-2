import express from 'express';
import caisseRoutes from './caisseRoutes';

const router = express.Router();

router.use('/caisses', caisseRoutes);

export default router;
