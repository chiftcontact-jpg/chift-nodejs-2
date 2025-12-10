import { Router } from 'express';
import {
  getProfilAgent,
  updateProfilAgent,
  activerService,
  activerCSU,
  getAllAgents,
  createAgent
} from '../controllers/agentController';
import { protect } from '../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(protect);

// GET /api/v1/agents - Récupérer tous les agents (admin)
router.get('/', getAllAgents);

// POST /api/v1/agents - Créer un agent (admin)
router.post('/', createAgent);

// GET /api/v1/agents/profil - Récupérer le profil de l'agent connecté
router.get('/profil', getProfilAgent);

// PATCH /api/v1/agents/profil - Mettre à jour le profil de l'agent connecté
router.patch('/profil', updateProfilAgent);

// POST /api/v1/agents/services/:service/activer - Activer un service CHIFT
router.post('/services/:service/activer', activerService);

// POST /api/v1/agents/csu/activer - Activer le CSU
router.post('/csu/activer', activerCSU);

export default router;
