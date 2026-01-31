import { Router } from 'express';
import UtilisateurController from '../controllers/utilisateurController';
import { protect, authorize } from '../middlewares/auth';
import { schemas, validate } from '../middlewares/validation';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes CRUD
router.post('/', authorize('ADMIN', 'AGENT'), validate(schemas.createUtilisateur), UtilisateurController.creerUtilisateur);

/**
 * @route   GET /api/v1/utilisateurs
 * @desc    Liste tous les utilisateurs (avec filtres)
 * @access  Agent, Maker, Admin, Mutuelle
 */
router.get(
  '/',
  authorize('agent', 'maker', 'admin', 'mutuelle'),
  UtilisateurController.listerUtilisateurs
);

/**
 * @route   GET /api/v1/utilisateurs/search
 * @desc    Rechercher des utilisateurs
 * @access  Agent, Maker, Admin, Mutuelle
 */
router.get(
  '/search',
  authorize('agent', 'maker', 'admin', 'mutuelle'),
  UtilisateurController.rechercherUtilisateurs
);

/**
 * @route   GET /api/v1/utilisateurs/:id
 * @desc    Récupère un utilisateur par ID
 * @access  Agent, Maker, Admin, Mutuelle
 */
router.get(
  '/:id',
  authorize('agent', 'maker', 'admin', 'mutuelle'),
  UtilisateurController.getUtilisateur
);

/**
 * @route   PUT /api/v1/utilisateurs/:id
 * @desc    Met à jour un utilisateur
 * @access  Agent, Maker, Admin
 */
router.put(
  '/:id',
  authorize('agent', 'maker', 'admin'),
  UtilisateurController.mettreAJourUtilisateur
);

/**
 * @route   POST /api/v1/utilisateurs/:id/carte-nfc
 * @desc    Attribuer une carte NFC à un utilisateur
 * @access  Mutuelle, Admin
 */
router.post(
  '/:id/carte-nfc',
  authorize('mutuelle', 'admin'),
  UtilisateurController.attribuerCarteNFC
);

export default router;