import nodemailer, { Transporter } from 'nodemailer';
import config from '../config';
import logger from '../utils/logger';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  context?: any;
  attachments?: any[];
}

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.auth,
      connectionTimeout: 10000, // 10 secondes
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: false,
      debug: false,
      tls: {
        rejectUnauthorized: false, // Pour les certificats auto-signés
      },
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info(`✅ Connexion SMTP établie: ${config.smtp.host}:${config.smtp.port}`);
    } catch (error: any) {
      logger.error('❌ Erreur connexion SMTP:', {
        host: config.smtp.host,
        port: config.smtp.port,
        error: error.message,
        code: error.code
      });
      logger.warn('⚠️  Continuant sans vérification SMTP - les emails pourraient échouer');
    }
  }

  private compileTemplate(templateName: string, context: any): string {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} introuvable`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    return template(context);
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      let html = options.html;

      // Si un template est spécifié, le compiler
      if (options.template && options.context) {
        html = this.compileTemplate(options.template, options.context);
      }

      const mailOptions = {
        from: `${config.email.fromName} <${config.email.from}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html,
        text: options.text,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('📧 Email envoyé:', { to: options.to, messageId: info.messageId });
      return true;
    } catch (error: any) {
      logger.error('❌ Erreur envoi email:', error.message);
      throw error;
    }
  }

  // Email de bienvenue
  async sendWelcomeEmail(to: string, name: string, resetUrl?: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Bienvenue sur Chift - Définissez votre mot de passe',
      template: 'welcome',
      context: { name, resetUrl },
    });
  }

  // Email de réinitialisation de mot de passe
  async sendPasswordResetEmail(to: string, resetUrl: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Réinitialisation de votre mot de passe',
      template: 'password-reset',
      context: { name, resetUrl },
    });
  }

  // Email de notification de souscription
  async sendSubscriptionNotification(to: string, data: any): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Nouvelle souscription',
      template: 'subscription',
      context: data,
    });
  }

  // Email de notification de caisse
  async sendCaisseNotification(to: string, data: any): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Notification Caisse',
      template: 'caisse-notification',
      context: data,
    });
  }

  // Email générique
  async sendGenericEmail(to: string | string[], subject: string, html: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject,
      html,
    });
  }
}

export default new MailService();
