import { Router } from 'express';
import {
  getCaisses,
  getCaisseById,
  createCaisse,
  updateCaisse,
  deleteCaisse,
  addMaker,
  removeMaker
} from '../controllers/caisseController';
import { protect } from '../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(protect);

// GET /api/v1/caisses - Récupérer toutes les caisses avec filtres
router.get('/', getCaisses);

// GET /api/v1/caisses/:id - Récupérer une caisse par ID
router.get('/:id', getCaisseById);

// POST /api/v1/caisses - Créer une nouvelle caisse
router.post('/', createCaisse);

// PATCH /api/v1/caisses/:id - Mettre à jour une caisse
router.patch('/:id', updateCaisse);

// DELETE /api/v1/caisses/:id - Supprimer une caisse
router.delete('/:id', deleteCaisse);

// POST /api/v1/caisses/:id/makers - Ajouter un maker à une caisse
router.post('/:id/makers', addMaker);

// DELETE /api/v1/caisses/:id/makers/:makerId - Retirer un maker d'une caisse
router.delete('/:id/makers/:makerId', removeMaker);

export default router;
