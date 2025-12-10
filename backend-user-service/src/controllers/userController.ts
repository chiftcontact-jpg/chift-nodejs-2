import { Request, Response } from 'express';
import userService from '../services/userService';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';

export class UserController {
  // Créer un utilisateur
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: user
      });
    } catch (error) {
      throw error;
    }
  }

  // Login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email et mot de passe requis', 400);
      }

      const result = await userService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: result
      });
    } catch (error) {
      throw error;
    }
  }

  // Obtenir le profil de l'utilisateur connecté
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Utilisateur non authentifié', 401);
      }

      const user = await userService.getUserById(req.user.userId);

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      throw error;
    }
  }

  // Obtenir un utilisateur par ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      throw error;
    }
  }

  // Obtenir tous les utilisateurs
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { role, statut, page, limit } = req.query;

      const result = await userService.getAllUsers({
        role: role as string,
        statut: statut as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body);

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: user
      });
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un utilisateur
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);

      if (!deleted) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      throw error;
    }
  }

  // Changer le statut
  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { statut } = req.body;

      if (!['actif', 'inactif', 'suspendu'].includes(statut)) {
        throw new AppError('Statut invalide', 400);
      }

      const user = await userService.changeUserStatus(id, statut);

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Statut mis à jour avec succès',
        data: user
      });
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour les permissions
  async updatePermissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { permissions } = req.body;

      if (!Array.isArray(permissions)) {
        throw new AppError('Permissions invalides', 400);
      }

      const user = await userService.updatePermissions(id, permissions);

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Permissions mises à jour avec succès',
        data: user
      });
    } catch (error) {
      throw error;
    }
  }

  // Changer le mot de passe
  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError('Mot de passe actuel et nouveau mot de passe requis', 400);
      }

      if (newPassword.length < 8) {
        throw new AppError('Le nouveau mot de passe doit contenir au moins 8 caractères', 400);
      }

      const user = await userService.updatePassword(id, currentPassword, newPassword);

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Mot de passe mis à jour avec succès'
      });
    } catch (error) {
      throw error;
    }
  }

  // Générer/Récupérer le QR code d'un utilisateur
  async getUserQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const qrCode = await userService.generateUserQRCode(id);

      res.status(200).json({
        success: true,
        message: 'QR code généré avec succès',
        data: { qrCode }
      });
    } catch (error) {
      throw error;
    }
  }

  // Obtenir les statistiques des utilisateurs
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await userService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      throw error;
    }
  }

  // Définir le mot de passe avec le token
  async setPasswordWithToken(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        throw new AppError('Token et mot de passe requis', 400);
      }

      if (password.length < 6) {
        throw new AppError('Le mot de passe doit contenir au moins 6 caractères', 400);
      }

      await userService.setPasswordWithToken(token, password);

      res.status(200).json({
        success: true,
        message: 'Mot de passe défini avec succès'
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new UserController();
