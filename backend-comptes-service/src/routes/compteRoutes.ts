import { Router } from 'express';
import * as compteController from '../controllers/compteController';

const router = Router();

router.get('/user/:userId', compteController.getUserComptes);
router.post('/', compteController.createCompte);
router.patch('/:id/status', compteController.updateCompteStatus);

export default router;
