import { Router } from 'express';
import SouscriptionController from '../controllers/souscriptionController';
import { protect, authorize } from '../middlewares/auth';
import { validate, schemas } from '../middlewares/validation';

const router = Router();

// Routes protégées
router.use(protect);

/**
 * @route   POST /api/v1/souscriptions
 * @desc    Créer une nouvelle souscription
 * @access  Agent, Maker, Admin
 */
router.post(
  '/',
  authorize('agent', 'maker', 'admin'),
  validate(schemas.createSouscription),
  SouscriptionController.creerSouscription
);

/**
 * @route   GET /api/v1/souscriptions
 * @desc    Liste toutes les souscriptions (avec filtres)
 * @access  Agent, Maker, Admin, Mutuelle
 */
router.get(
  '/',
  authorize('agent', 'maker', 'admin', 'mutuelle'),
  SouscriptionController.listerSouscriptions
);

/**
 * @route   GET /api/v1/souscriptions/:id
 * @desc    Récupère une souscription par ID
 * @access  Agent, Maker, Admin, Mutuelle
 */
router.get(
  '/:id',
  authorize('agent', 'maker', 'admin', 'mutuelle'),
  SouscriptionController.getSouscription
);

/**
 * @route   POST /api/v1/souscriptions/:id/enrolement
 * @desc    Traiter l'enrôlement d'une souscription
 * @access  Agent, Admin
 */
router.post(
  '/:id/enrolement',
  authorize('agent', 'admin'),
  SouscriptionController.traiterEnrolement
);

/**
 * @route   POST /api/v1/souscriptions/:id/validation
 * @desc    Valider une souscription
 * @access  Admin
 */
router.post(
  '/:id/validation',
  authorize('admin'),
  SouscriptionController.validerSouscription
);

/**
 * @route   POST /api/v1/souscriptions/:id/activation
 * @desc    Activer une souscription
 * @access  Admin, Mutuelle
 */
router.post(
  '/:id/activation',
  authorize('admin', 'mutuelle'),
  SouscriptionController.activerSouscription
);

export default router;
