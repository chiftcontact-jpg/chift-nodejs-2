import { Router } from 'express';
import UtilisateurController from '../controllers/adherentController';
import { protect, authorize } from '../middlewares/auth';
import { validate, schemas } from '../middlewares/validation';

const router = Router();

// Routes protégées - nécessitent authentification
router.use(protect);

/**
 * @route   POST /api/v1/utilisateurs
 * @desc    Créer un nouvel utilisateur
 * @access  Agent, Maker, Admin
 */
router.post(
  '/',
  authorize('agent', 'maker', 'admin'),
  validate(schemas.createUtilisateur),
  UtilisateurController.creerUtilisateur
);

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
