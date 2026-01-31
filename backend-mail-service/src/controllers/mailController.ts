import { Request, Response } from 'express';
import mailService from '../services/mailService';
import logger from '../utils/logger';

export class MailController {
  // Envoyer un email de bienvenue
  async sendWelcome(req: Request, res: Response): Promise<void> {
    try {
      const { to, name, resetUrl, role, credentials, loginUrl } = req.body;

      if (!to || !name) {
        res.status(400).json({
          success: false,
          message: 'Email et nom requis',
        });
        return;
      }

      await mailService.sendWelcomeEmail(to, name, resetUrl, role, credentials, loginUrl);

      res.status(200).json({
        success: true,
        message: 'Email de bienvenue envoyé',
      });
    } catch (error: any) {
      logger.error('Erreur envoi welcome email:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.message,
      });
    }
  }

  // Envoyer un email de réinitialisation de mot de passe
  async sendPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { to, resetUrl, name } = req.body;

      if (!to || !resetUrl || !name) {
        res.status(400).json({
          success: false,
          message: 'Email, URL de réinitialisation et nom requis',
        });
        return;
      }

      await mailService.sendPasswordResetEmail(to, resetUrl, name);

      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé',
      });
    } catch (error: any) {
      logger.error('Erreur envoi password reset email:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.message,
      });
    }
  }

  // Envoyer un email de notification de souscription
  async sendSubscriptionNotification(req: Request, res: Response): Promise<void> {
    try {
      const { to, data } = req.body;

      if (!to || !data) {
        res.status(400).json({
          success: false,
          message: 'Email et données requis',
        });
        return;
      }

      await mailService.sendSubscriptionNotification(to, data);

      res.status(200).json({
        success: true,
        message: 'Notification de souscription envoyée',
      });
    } catch (error: any) {
      logger.error('Erreur envoi subscription notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de la notification',
        error: error.message,
      });
    }
  }

  // Envoyer un email de notification de caisse
  async sendCaisseNotification(req: Request, res: Response): Promise<void> {
    try {
      const { to, data } = req.body;

      if (!to || !data) {
        res.status(400).json({
          success: false,
          message: 'Email et données requis',
        });
        return;
      }

      await mailService.sendCaisseNotification(to, data);

      res.status(200).json({
        success: true,
        message: 'Notification de caisse envoyée',
      });
    } catch (error: any) {
      logger.error('Erreur envoi caisse notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de la notification',
        error: error.message,
      });
    }
  }

  // Envoyer un email générique
  async sendGeneric(req: Request, res: Response): Promise<void> {
    try {
      const { to, subject, html } = req.body;

      if (!to || !subject || !html) {
        res.status(400).json({
          success: false,
          message: 'Email, sujet et contenu HTML requis',
        });
        return;
      }

      await mailService.sendGenericEmail(to, subject, html);

      res.status(200).json({
        success: true,
        message: 'Email envoyé avec succès',
      });
    } catch (error: any) {
      logger.error('Erreur envoi generic email:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.message,
      });
    }
  }

  // Health check
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'ok',
      service: 'mail-service',
      timestamp: new Date().toISOString(),
    });
  }
}

export default new MailController();
