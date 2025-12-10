import { Request, Response, NextFunction } from 'express';
import SouscriptionService from '../services/souscriptionService';

class SouscriptionController {
  /**
   * Crée une nouvelle souscription
   */
  async creerSouscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const souscription = await SouscriptionService.creerSouscription(req.body);

      res.status(201).json({
        success: true,
        message: 'Souscription créée avec succès',
        data: souscription
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Traite l'enrôlement
   */
  async traiterEnrolement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SouscriptionService.traiterEnrolement(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Enrôlement complété',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Valide une souscription
   */
  async validerSouscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const souscription = await SouscriptionService.validerSouscription(
        req.params.id,
        req.body.validateurId
      );

      res.status(200).json({
        success: true,
        message: 'Souscription validée',
        data: souscription
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Active une souscription
   */
  async activerSouscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const souscription = await SouscriptionService.activerSouscription(
        req.params.id,
        req.body.mutuelleAssignee
      );

      res.status(200).json({
        success: true,
        message: 'Souscription activée',
        data: souscription
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Liste les souscriptions
   */
  async listerSouscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        statut: req.query.statut,
        etapeActuelle: req.query.etapeActuelle,
        typeSouscription: req.query.typeSouscription,
        agentCollecteId: req.query.agentCollecteId
      };

      const souscriptions = await SouscriptionService.listerSouscriptions(filters);

      res.status(200).json({
        success: true,
        count: souscriptions.length,
        data: souscriptions
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère une souscription
   */
  async getSouscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const souscription = await SouscriptionService.getSouscriptionById(req.params.id);

      res.status(200).json({
        success: true,
        data: souscription
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SouscriptionController();
