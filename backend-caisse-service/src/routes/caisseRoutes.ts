import express from 'express';
import caisseController from '../controllers/caisseController';

const router = express.Router();

// Routes publiques (pas d'authentification pour le moment)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'caisse-service' });
});

// Statistiques
router.get('/statistics', caisseController.getStatistics.bind(caisseController));

// CRUD
router.post('/', caisseController.createCaisse.bind(caisseController));
router.get('/', caisseController.getAllCaisses.bind(caisseController));
router.get('/:id', caisseController.getCaisseById.bind(caisseController));
router.put('/:id', caisseController.updateCaisse.bind(caisseController));
router.patch('/:id/status', caisseController.changeStatus.bind(caisseController));
router.delete('/:id', caisseController.deleteCaisse.bind(caisseController));

export default router;
