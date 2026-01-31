import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';

const router = Router();

router.get('/user/:userId', serviceController.getUserServices);
router.post('/', serviceController.createService);
router.post('/add-compte', serviceController.addCompteToService);

export default router;
