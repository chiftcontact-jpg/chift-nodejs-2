import QRCode from 'qrcode';
import logger from '../utils/logger';

interface UserQRData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: string;
  organisation?: string;
  createdAt: Date;
  codeUtilisateur?: string;
  adhesion?: any;
  leket?: any;
  csu?: any;
}

class QRCodeService {
  /**
   * Génère un QR code contenant les informations de l'utilisateur
   * @param userData - Les données de l'utilisateur à encoder
   * @returns Le QR code en format Data URL (base64)
   */
  async generateUserQRCode(userData: UserQRData): Promise<string> {
    try {
      // Créer un objet JSON avec les informations de l'utilisateur
      const qrData = {
        id: userData.id,
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        telephone: userData.telephone || '',
        role: userData.role,
        organisation: userData.organisation || '',
        codeUtilisateur: userData.codeUtilisateur || '',
        adhesion: userData.adhesion || null,
        leket: userData.leket || null,
        csu: userData.csu || null,
        createdAt: userData.createdAt.toISOString(),
        generatedAt: new Date().toISOString(),
      };

      // Convertir en JSON string
      const jsonString = JSON.stringify(qrData);

      // Générer le QR code en Data URL format avec options simplifiées
      const qrCodeDataURL = await QRCode.toDataURL(jsonString, {
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 1
      });

      logger.info(`QR code généré pour l'utilisateur: ${userData.email}`);
      return qrCodeDataURL;
    } catch (error) {
      logger.error('Erreur génération QR code:', error);
      throw new Error('Impossible de générer le QR code');
    }
  }

  /**
   * Génère un QR code simplifié avec uniquement l'ID utilisateur
   * @param userId - L'ID de l'utilisateur
   * @returns Le QR code en format Data URL (base64)
   */
  async generateSimpleQRCode(userId: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(userId, {
        errorCorrectionLevel: 'M',
        width: 200
      });

      logger.info(`QR code simple généré pour l'utilisateur ID: ${userId}`);
      return qrCodeDataURL;
    } catch (error) {
      logger.error('Erreur génération QR code simple:', error);
      throw new Error('Impossible de générer le QR code');
    }
  }

  /**
   * Vérifie si un QR code est valide
   * @param qrCodeDataURL - Le QR code en format Data URL
   * @returns true si valide, false sinon
   */
  isValidQRCode(qrCodeDataURL: string): boolean {
    return qrCodeDataURL.startsWith('data:image/png;base64,');
  }
}

export default new QRCodeService();
