import express from 'express';
import { initializeDatabase } from '../controllers/initController';

const router = express.Router();

/**
 * @route   POST /api/init/database
 * @desc    Initialise la base de données avec les utilisateurs par défaut
 * @access  Public (à utiliser uniquement lors de la première installation)
 */
router.post('/database', initializeDatabase);

export default router;
