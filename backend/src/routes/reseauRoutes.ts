import { Router } from 'express';
import {
  getReseaux,
  getReseauById,
  createReseau,
  updateReseau,
  deleteReseau,
  addCaisseToReseau,
  removeCaisseFromReseau,
  addMembreToReseau
} from '../controllers/reseauController';
import { protect } from '../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(protect);

// GET /api/v1/reseaux - Récupérer tous les réseaux avec filtres
router.get('/', getReseaux);

// GET /api/v1/reseaux/:id - Récupérer un réseau par ID
router.get('/:id', getReseauById);

// POST /api/v1/reseaux - Créer un nouveau réseau
router.post('/', createReseau);

// PATCH /api/v1/reseaux/:id - Mettre à jour un réseau
router.patch('/:id', updateReseau);

// DELETE /api/v1/reseaux/:id - Supprimer un réseau
router.delete('/:id', deleteReseau);

// POST /api/v1/reseaux/:id/caisses - Ajouter une caisse au réseau
router.post('/:id/caisses', addCaisseToReseau);

// DELETE /api/v1/reseaux/:id/caisses/:caisseId - Retirer une caisse du réseau
router.delete('/:id/caisses/:caisseId', removeCaisseFromReseau);

// POST /api/v1/reseaux/:id/membres - Ajouter un membre au réseau
router.post('/:id/membres', addMembreToReseau);

export default router;
