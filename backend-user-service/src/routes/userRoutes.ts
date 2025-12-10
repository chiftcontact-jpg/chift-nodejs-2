import express, { Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

// Wrapper pour gérer les erreurs async
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Routes publiques
router.post('/login', asyncHandler(userController.login.bind(userController)));
router.post('/set-password', asyncHandler(userController.setPasswordWithToken.bind(userController)));

// Routes protégées
router.use(authenticate);

// Profil de l'utilisateur connecté
router.get('/profile', asyncHandler(userController.getProfile.bind(userController)));

// Routes ADMIN uniquement
router.get(
  '/statistics',
  authorize('ADMIN'),
  asyncHandler(userController.getStatistics.bind(userController))
);

router.post(
  '/',
  authorize('ADMIN'),
  asyncHandler(userController.createUser.bind(userController))
);

router.get(
  '/',
  authorize('ADMIN'),
  asyncHandler(userController.getAllUsers.bind(userController))
);

router.get(
  '/:id',
  authorize('ADMIN'),
  asyncHandler(userController.getUserById.bind(userController))
);

router.put(
  '/:id',
  authorize('ADMIN'),
  asyncHandler(userController.updateUser.bind(userController))
);

router.delete(
  '/:id',
  authorize('ADMIN'),
  asyncHandler(userController.deleteUser.bind(userController))
);

router.patch(
  '/:id/status',
  authorize('ADMIN'),
  asyncHandler(userController.changeStatus.bind(userController))
);

router.patch(
  '/:id/permissions',
  authorize('ADMIN'),
  asyncHandler(userController.updatePermissions.bind(userController))
);

router.patch(
  '/:id/password',
  asyncHandler(userController.updatePassword.bind(userController))
);

router.get(
  '/:id/qrcode',
  asyncHandler(userController.getUserQRCode.bind(userController))
);

export default router;
