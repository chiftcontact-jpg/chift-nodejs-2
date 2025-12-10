import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

/**
 * @route   GET /api/v1/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post('/login', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Route d\'authentification à implémenter'
  });
});

/**
 * @route   POST /api/v1/auth/register
 * @desc    Inscription utilisateur
 * @access  Admin
 */
router.post('/register', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Route d\'inscription à implémenter'
  });
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Obtenir l'utilisateur connecté
 * @access  Private
 */
router.get('/me', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Route profil à implémenter'
  });
});

export default router;
