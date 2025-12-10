import { Router } from 'express';
import AdhérentController from '../controllers/adherentController';
import { protect, authorize } from '../middlewares/auth';
import { validate, schemas } from '../middlewares/validation';

const router = Router();

// Routes protégées - nécessitent authentification
router.use(protect);

/**
 * @route   POST /api/v1/adherents
 * @desc    Créer un nouvel adhérent
 * @access  Agent, Maker, Admin
 */
router.post(
  '/',
  authorize('agent', 'maker', 'admin'),
  validate(schemas.createAdherent),
  AdhérentController.creerAdherent
);

/**
 * @route   GET /api/v1/adherents
 * @desc    Liste tous les adhérents (avec filtres)
 * @access  Agent, Maker, Admin, Mutuelle
 */
router.get(
  '/',
  authorize('agent', 'maker', 'admin', 'mutuelle'),
  AdhérentController.listerAdherents
);

/**
 * @route   GET /api/v1/adherents/search
 * @desc    Rechercher des adhérents
 * @access  Agent, Maker, Admin, Mutuelle
 */
router.get(
  '/search',
  authorize('agent', 'maker', 'admin', 'mutuelle'),
  AdhérentController.rechercherAdherents
);

/**
 * @route   GET /api/v1/adherents/:id
 * @desc    Récupère un adhérent par ID
 * @access  Agent, Maker, Admin, Mutuelle
 */
router.get(
  '/:id',
  authorize('agent', 'maker', 'admin', 'mutuelle'),
  AdhérentController.getAdherent
);

/**
 * @route   PUT /api/v1/adherents/:id
 * @desc    Met à jour un adhérent
 * @access  Agent, Maker, Admin
 */
router.put(
  '/:id',
  authorize('agent', 'maker', 'admin'),
  AdhérentController.mettreAJourAdherent
);

/**
 * @route   POST /api/v1/adherents/:id/carte-nfc
 * @desc    Attribuer une carte NFC à un adhérent
 * @access  Mutuelle, Admin
 */
router.post(
  '/:id/carte-nfc',
  authorize('mutuelle', 'admin'),
  AdhérentController.attribuerCarteNFC
);

export default router;
