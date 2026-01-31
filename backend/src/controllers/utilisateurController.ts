import { Request, Response, NextFunction } from 'express';
import UtilisateurService from '../services/utilisateurService';
import { AppError } from '../middlewares/errorHandler';

class UtilisateurController {
  /**
   * Crée un nouvel utilisateur
   */
  async creerUtilisateur(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const utilisateur = await UtilisateurService.creerUtilisateur(req.body);

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: utilisateur
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère un utilisateur par ID
   */
  async getUtilisateur(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const utilisateur = await UtilisateurService.getUtilisateurById(req.params.id);

      res.status(200).json({
        success: true,
        data: utilisateur
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Liste tous les utilisateurs
   */
  async listerUtilisateurs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        statut: req.query.statut,
        typeUtilisateur: req.query.typeUtilisateur,
        region: req.query.region,
        communauteId: req.query.communauteId
      };

      const utilisateurs = await UtilisateurService.listerUtilisateurs(filters);

      res.status(200).json({
        success: true,
        count: utilisateurs.length,
        data: utilisateurs
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour un utilisateur
   */
  async mettreAJourUtilisateur(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const utilisateur = await UtilisateurService.mettreAJourUtilisateur(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Utilisateur mis à jour',
        data: utilisateur
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Attribue une carte NFC
   */
  async attribuerCarteNFC(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { numeroSerie, mutuelleRecuperation } = req.body;

      if (!numeroSerie || !mutuelleRecuperation) {
        throw new AppError('Numéro de série et mutuelle requis', 400);
      }

      const utilisateur = await UtilisateurService.attribuerCarteNFC(
        req.params.id,
        numeroSerie,
        mutuelleRecuperation
      );

      res.status(200).json({
        success: true,
        message: 'Carte NFC attribuée',
        data: utilisateur
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recherche d'utilisateurs
   */
  async rechercherUtilisateurs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchTerm = req.query.q as string;

      if (!searchTerm) {
        throw new AppError('Terme de recherche requis', 400);
      }

      const utilisateurs = await UtilisateurService.rechercherUtilisateurs(searchTerm);

      res.status(200).json({
        success: true,
        count: utilisateurs.length,
        data: utilisateurs
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UtilisateurController();