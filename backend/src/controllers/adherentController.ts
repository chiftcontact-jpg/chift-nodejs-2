import { Request, Response, NextFunction } from 'express';
import AdhérentService from '../services/adherentService';
import { AppError } from '../middlewares/errorHandler';

class AdhérentController {
  /**
   * Crée un nouvel adhérent
   */
  async creerAdherent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adherent = await AdhérentService.creerAdherent(req.body);

      res.status(201).json({
        success: true,
        message: 'Adhérent créé avec succès',
        data: adherent
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère un adhérent par ID
   */
  async getAdherent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adherent = await AdhérentService.getAdherentById(req.params.id);

      res.status(200).json({
        success: true,
        data: adherent
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Liste tous les adhérents
   */
  async listerAdherents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        statut: req.query.statut,
        typeAdherent: req.query.typeAdherent,
        region: req.query.region,
        communauteId: req.query.communauteId
      };

      const adherents = await AdhérentService.listerAdherents(filters);

      res.status(200).json({
        success: true,
        count: adherents.length,
        data: adherents
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour un adhérent
   */
  async mettreAJourAdherent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adherent = await AdhérentService.mettreAJourAdherent(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Adhérent mis à jour',
        data: adherent
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

      const adherent = await AdhérentService.attribuerCarteNFC(
        req.params.id,
        numeroSerie,
        mutuelleRecuperation
      );

      res.status(200).json({
        success: true,
        message: 'Carte NFC attribuée',
        data: adherent
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recherche d'adhérents
   */
  async rechercherAdherents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchTerm = req.query.q as string;

      if (!searchTerm) {
        throw new AppError('Terme de recherche requis', 400);
      }

      const adherents = await AdhérentService.rechercherAdherents(searchTerm);

      res.status(200).json({
        success: true,
        count: adherents.length,
        data: adherents
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdhérentController();
