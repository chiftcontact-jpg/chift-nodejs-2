import { Request, Response } from 'express';
import caisseService from '../services/caisseService';

export class CaisseController {
  // Créer une caisse
  async createCaisse(req: Request, res: Response): Promise<void> {
    try {
      console.log('📦 Données reçues pour création caisse:', JSON.stringify(req.body, null, 2));
      
      const caisse = await caisseService.createCaisse(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Caisse créée avec succès',
        data: caisse
      });
    } catch (error: any) {
      console.error('❌ Erreur création caisse:', error);
      
      // Détails de l'erreur de validation Mongoose
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        
        res.status(400).json({
          success: false,
          message: 'Erreur de validation',
          errors: validationErrors
        });
        return;
      }
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création de la caisse',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Récupérer toutes les caisses
  async getAllCaisses(req: Request, res: Response): Promise<void> {
    try {
      const { region, departement, commune, statut, type, page, limit } = req.query;
      
      const result = await caisseService.getAllCaisses({
        region: region as string,
        departement: departement as string,
        commune: commune as string,
        statut: statut as string,
        type: type as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des caisses'
      });
    }
  }

  // Récupérer une caisse par ID
  async getCaisseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const caisse = await caisseService.getCaisseById(id);

      res.status(200).json({
        success: true,
        data: caisse
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Caisse non trouvée'
      });
    }
  }

  // Mettre à jour une caisse
  async updateCaisse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const caisse = await caisseService.updateCaisse(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Caisse mise à jour avec succès',
        data: caisse
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour de la caisse'
      });
    }
  }

  // Supprimer une caisse
  async deleteCaisse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await caisseService.deleteCaisse(id);

      res.status(200).json({
        success: true,
        message: 'Caisse supprimée avec succès'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression de la caisse'
      });
    }
  }

  // Changer le statut d'une caisse
  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      
      if (!statut || !['active', 'inactive'].includes(statut)) {
        res.status(400).json({
          success: false,
          message: 'Statut invalide. Utilisez "active" ou "inactive"'
        });
        return;
      }

      const caisse = await caisseService.updateCaisse(id, { statut });

      res.status(200).json({
        success: true,
        message: `Caisse ${statut === 'active' ? 'activée' : 'désactivée'} avec succès`,
        data: caisse
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors du changement de statut'
      });
    }
  }

  // Récupérer les statistiques
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await caisseService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des statistiques'
      });
    }
  }
}

export default new CaisseController();
