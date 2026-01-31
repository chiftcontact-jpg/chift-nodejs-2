import { Request, Response } from 'express';
import axios from 'axios';
import config from '../config';
import logger from '../utils/logger';

export class AuthController {
  // Connexion via le gateway
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      logger.info('Requête de login reçue au gateway', { 
        email, 
        hasPassword: !!password,
        body: JSON.stringify(req.body) 
      });

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis',
        });
        return;
      }

      logger.info('Tentative de connexion via gateway', { email, target: `${config.services.user}/api/users/login` });

      // Appeler le service utilisateur pour la connexion
      const response = await axios.post(
        `${config.services.user}/api/users/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // Augmentation du timeout à 10s
        }
      );

      logger.info('Connexion réussie via gateway', {
        email,
        userId: response.data.data.user._id,
      });

      res.status(200).json(response.data);
    } catch (error: any) {
      logger.error('Erreur de connexion via gateway', {
        error: error.message,
        email: req.body.email,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la connexion',
        });
      }
    }
  }

  // Inscription via le gateway (endpoint public)
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;

      logger.info('Tentative d\'inscription via gateway', {
        email: userData.email,
      });

      // Appeler le endpoint de login du service utilisateur
      // pour créer un utilisateur (auto-inscription)
      const response = await axios.post(
        `${config.services.user}/api/users/register`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('Inscription réussie via gateway', {
        email: userData.email,
        userId: response.data.data.user?._id || response.data.data._id,
      });

      res.status(201).json(response.data);
    } catch (error: any) {
      logger.error('Erreur d\'inscription via gateway', {
        error: error.message,
        email: req.body.email,
      });

      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'inscription',
        });
      }
    }
  }

  // Rafraîchir le token
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Token de rafraîchissement requis',
        });
        return;
      }

      logger.info('Rafraîchissement de token via gateway');

      // Appeler le service utilisateur pour rafraîchir le token
      const response = await axios.post(
        `${config.services.user}/api/users/refresh-token`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('Token rafraîchi avec succès via gateway');

      res.status(200).json(response.data);
    } catch (error: any) {
      logger.error('Erreur de rafraîchissement de token via gateway', {
        error: error.message,
      });

      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors du rafraîchissement du token',
        });
      }
    }
  }

  // Déconnexion
  async logout(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Déconnexion via gateway');

      // Pour le moment, la déconnexion est côté client (suppression du token)
      // On peut ajouter une liste noire de tokens côté serveur si nécessaire

      res.status(200).json({
        success: true,
        message: 'Déconnexion réussie',
      });
    } catch (error: any) {
      logger.error('Erreur de déconnexion via gateway', {
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la déconnexion',
      });
    }
  }
}

export default new AuthController();
