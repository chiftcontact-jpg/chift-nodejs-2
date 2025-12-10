import { Router } from 'express';
import mailController from '../controllers/mailController';

const router = Router();

// Health check
router.get('/health', mailController.healthCheck.bind(mailController));

// Routes d'envoi d'emails
router.post('/send/welcome', mailController.sendWelcome.bind(mailController));
router.post('/send/password-reset', mailController.sendPasswordReset.bind(mailController));
router.post('/send/subscription', mailController.sendSubscriptionNotification.bind(mailController));
router.post('/send/caisse', mailController.sendCaisseNotification.bind(mailController));
router.post('/send/generic', mailController.sendGeneric.bind(mailController));

export default router;
