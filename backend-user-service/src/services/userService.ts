import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler';
import logger from '../utils/logger';
import axios from 'axios';
import config from '../config';
import { REGIONS_CODES, DEPARTEMENTS_CODES } from '../utils/geoCodes';

export class UserService {
  // Générer un code utilisateur unique
  private async generateUserCode(userData: any): Promise<{ code: string; order: number }> {
    const { region, departement, commune } = userData;
    
    const regionKey = (region || '').toUpperCase();
    const deptKey = (departement || '').toUpperCase();
    
    const rCode = REGIONS_CODES[regionKey as keyof typeof REGIONS_CODES] || '0';
    const dCode = DEPARTEMENTS_CODES[deptKey as keyof typeof DEPARTEMENTS_CODES] || '000';
    const communePrefix = commune ? commune.substring(0, 3).toUpperCase() : 'XXX';
    
    // Trouver l'ordre d'enrôlement dans la même zone géographique
    const count = await User.countDocuments({
      region: region,
      departement: departement,
      commune: commune
    });
    
    const order = count + 1;
    const orderStr = String(order).padStart(4, '0');
    
    // Format: USR-R-DEPT-COMM-ORDER (ex: USR-1-101-DAK-0001)
    const code = `USR-${rCode}-${dCode}-${communePrefix}-${orderStr}`;
    
    return { code, order };
  }

  // Créer un utilisateur
  async createUser(userData: any): Promise<IUser> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username || userData.email }]
      });

      if (existingUser) {
        throw new AppError('Email ou nom d\'utilisateur déjà utilisé', 400);
      }

      // Préparer les données pour le modèle User
      const preparedData: any = {
        ...userData,
        username: userData.username || userData.email,
        rolePrincipal: userData.role || 'UTILISATEUR',
      };

      // Si c'est un utilisateur simple, on peut lui ajouter le rôle dans la liste des rôles
      if (!preparedData.roles) {
        preparedData.roles = [{
          role: preparedData.rolePrincipal,
          dateAttribution: new Date(),
          actif: true
        }];
      }

      // Gérer les dates (conversion string -> Date si nécessaire)
      if (typeof preparedData.dateNaissance === 'string') {
        preparedData.dateNaissance = new Date(preparedData.dateNaissance);
      }
      if (preparedData.adhesion && typeof preparedData.adhesion.date === 'string') {
        preparedData.adhesion.date = new Date(preparedData.adhesion.date);
      }

      // Gérer la date de récupération LEKET
      if (preparedData.leket && preparedData.leket.souscrit && preparedData.leket.evenementButoir) {
        const { mois, annee } = preparedData.leket.evenementButoir;
        const joursAvant = preparedData.leket.joursAvantButoir || 1;
        
        // Convertir le nom du mois en index (0-11)
        const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const moisIndex = moisNoms.indexOf(mois);
        
        if (moisIndex !== -1 && annee) {
          // Date butoir (dernier jour du mois choisi)
          const dateButoir = new Date(parseInt(annee), moisIndex + 1, 0);
          // Date de récupération (X jours avant)
          const dateRecuperation = new Date(dateButoir);
          dateRecuperation.setDate(dateButoir.getDate() - joursAvant);
          preparedData.leket.dateRecuperation = dateRecuperation;
        } else {
          preparedData.leket.dateRecuperation = new Date();
        }
      }

      // Gérer les bénéficiaires (mapping frontend -> backend)
      if (preparedData.beneficiaires && Array.isArray(preparedData.beneficiaires)) {
        preparedData.beneficiaires = preparedData.beneficiaires.map((b: any) => ({
          nom: b.nom,
          prenom: b.prenom,
          relation: b.lienParente || b.relation,
          telephone: b.telephone
        }));
      }

      // Gérer l'adhésion et la codification
      if (!preparedData.adhesion) {
        preparedData.adhesion = {};
      }

      const { code, order } = await this.generateUserCode(preparedData);
      preparedData.adhesion.codeUtilisateur = code;
      preparedData.adhesion.ordreEnrolement = order;

      // Générer un mot de passe temporaire par défaut
      const defaultPassword = "Chift" + Math.random().toString(36).substring(2, 8).toUpperCase() + "!";
      preparedData.password = await bcrypt.hash(defaultPassword, 10);
      preparedData.mustChangePassword = true;
      
      // Générer le token de réinitialisation (valide 7 jours)
      const resetToken = crypto.randomBytes(32).toString('hex');
      preparedData.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      preparedData.resetPasswordExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

      const user = new User(preparedData);
      await user.save();

      logger.info(`Utilisateur créé: ${user.email}`);

      // Envoyer l'email de bienvenue avec le lien de réinitialisation et les accès par défaut
      try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3046';
        const resetUrl = `${frontendUrl}/set-password?token=${resetToken}`;
        const loginUrl = `${frontendUrl}/login`;
        
        await axios.post(`${config.services.mail}/api/mail/send/welcome`, {
          to: user.email,
          name: `${user.prenom} ${user.nom}`,
          role: user.rolePrincipal,
          credentials: {
            email: user.email,
            password: defaultPassword
          },
          loginUrl,
          resetUrl
        });
        
        logger.info(`Email de bienvenue envoyé à: ${user.email}`);
      } catch (emailError: any) {
        logger.error('Erreur envoi email de bienvenue:', emailError.message);
        // Ne pas bloquer la création de l'utilisateur si l'email échoue
      }

      return user;
    } catch (error) {
      logger.error('Erreur création utilisateur:', error);
      throw error;
    }
  }

  // Authentification
  async login(email: string, password: string): Promise<{
    user: Partial<IUser>;
    token: string;
    refreshToken: string;
  }> {
    try {
      // Trouver l'utilisateur avec le mot de passe
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new AppError('Email ou mot de passe incorrect', 401);
      }

      // Vérifier le statut
      if (user.statut !== 'actif') {
        throw new AppError('Compte inactif ou suspendu', 403);
      }

      // Vérifier le mot de passe
      logger.debug(`Comparaison du mot de passe pour ${email}`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      logger.debug(`Résultat comparaison pour ${email}: ${isPasswordValid}`);

      if (!isPasswordValid) {
        // Incrémenter les tentatives
        user.tentativesConnexion += 1;
        
        if (user.tentativesConnexion >= 5) {
          user.statut = 'suspendu';
          await user.save();
          throw new AppError('Compte suspendu suite à trop de tentatives', 403);
        }

        await user.save();
        throw new AppError('Email ou mot de passe incorrect', 401);
      }

      // Réinitialiser les tentatives et mettre à jour la dernière connexion
      user.tentativesConnexion = 0;
      user.derniereConnexion = new Date();
      await user.save();

      // Générer les tokens
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.rolePrincipal,
        roles: user.roles,
        mustChangePassword: user.mustChangePassword
      };

      const token = generateToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      logger.info(`Connexion réussie: ${user.email}`);

      // Retourner sans le mot de passe
      const userObject = user.toObject();
      const { password: _, ...userWithoutPassword } = userObject;

      return {
        user: userWithoutPassword,
        token,
        refreshToken
      };
    } catch (error) {
      logger.error('Erreur login:', error);
      throw error;
    }
  }

  // Obtenir un utilisateur par ID
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      logger.error('Erreur récupération utilisateur:', error);
      throw error;
    }
  }

  // Obtenir un utilisateur par email
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      logger.error('Erreur récupération utilisateur:', error);
      throw error;
    }
  }

  // Obtenir tous les utilisateurs
  async getAllUsers(filters?: {
    role?: string;
    statut?: string;
    region?: string;
    departement?: string;
    commune?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: IUser[]; total: number; page: number; pages: number }> {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const skip = (page - 1) * limit;

      const query: any = {};
      if (filters?.role) query.rolePrincipal = filters.role;
      if (filters?.statut) query.statut = filters.statut;
      if (filters?.region) query.region = filters.region;
      if (filters?.departement) query.departement = filters.departement;
      if (filters?.commune) query.commune = filters.commune;

      const [users, total] = await Promise.all([
        User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments(query)
      ]);

      return {
        users,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Erreur récupération utilisateurs:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    try {
      // Si le mot de passe est mis à jour, le hasher
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (user) {
        logger.info(`Utilisateur mis à jour: ${user.email}`);
      }

      return user;
    } catch (error) {
      logger.error('Erreur mise à jour utilisateur:', error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(userId);
      
      if (result) {
        logger.info(`Utilisateur supprimé: ${result.email}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Erreur suppression utilisateur:', error);
      throw error;
    }
  }

  // Changer le statut d'un utilisateur
  async changeUserStatus(
    userId: string,
    statut: 'actif' | 'inactif' | 'suspendu'
  ): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { statut } },
        { new: true }
      );

      if (user) {
        logger.info(`Statut utilisateur changé: ${user.email} -> ${statut}`);
      }

      return user;
    } catch (error) {
      logger.error('Erreur changement statut:', error);
      throw error;
    }
  }

  // Mettre à jour les permissions
  async updatePermissions(userId: string, permissions: string[]): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { permissions } },
        { new: true }
      );

      if (user) {
        logger.info(`Permissions mises à jour: ${user.email}`);
      }

      return user;
    } catch (error) {
      logger.error('Erreur mise à jour permissions:', error);
      throw error;
    }
  }

  // Changer le mot de passe
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<IUser | null> {
    try {
      // Récupérer l'utilisateur avec le mot de passe
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      // Vérifier le mot de passe actuel
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        throw new AppError('Mot de passe actuel incorrect', 401);
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe
      user.password = hashedPassword;
      user.mustChangePassword = false;
      await user.save();

      logger.info(`Mot de passe mis à jour: ${user.email}`);

      return user;
    } catch (error) {
      logger.error('Erreur mise à jour mot de passe:', error);
      throw error;
    }
  }

  // Générer le QR code d'un utilisateur
  async generateUserQRCode(userId: string): Promise<string> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      // Si le QR code existe déjà, le retourner
      if (user.qrCode) {
        logger.info(`QR code existant retourné: ${user.email}`);
        return user.qrCode;
      }

      // Importer le service QR code
      const qrCodeService = (await import('./qrCodeService')).default;

      // Générer le QR code avec les informations de l'utilisateur
      const qrCodeDataURL = await qrCodeService.generateUserQRCode({
        id: user._id.toString(),
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.rolePrincipal,
        organisation: undefined, // Peut être étendu si nécessaire
        createdAt: user.createdAt,
        codeUtilisateur: user.adhesion?.codeUtilisateur,
        adhesion: user.adhesion,
        leket: user.leket,
        csu: user.csu
      });

      // Sauvegarder le QR code dans la base de données
      user.qrCode = qrCodeDataURL;
      await user.save();

      logger.info(`QR code généré et sauvegardé: ${user.email}`);

      return qrCodeDataURL;
    } catch (error) {
      logger.error('Erreur génération QR code utilisateur:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des utilisateurs
  async getStatistics(): Promise<{
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
    recentUsers: number;
  }> {
    try {
      const [total, byRole, byStatus, recentUsers] = await Promise.all([
        // Total des utilisateurs
        User.countDocuments(),
        
        // Comptage par rôle
        User.aggregate([
          { $group: { _id: '$rolePrincipal', count: { $sum: 1 } } }
        ]),
        
        // Comptage par statut
        User.aggregate([
          { $group: { _id: '$statut', count: { $sum: 1 } } }
        ]),
        
        // Utilisateurs créés dans les 30 derniers jours
        User.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        })
      ]);

      // Formater les résultats
      const roleStats: Record<string, number> = {};
      byRole.forEach((item: any) => {
        roleStats[item._id] = item.count;
      });

      const statusStats: Record<string, number> = {};
      byStatus.forEach((item: any) => {
        statusStats[item._id] = item.count;
      });

      logger.info('Statistiques récupérées avec succès');

      return {
        total,
        byRole: roleStats,
        byStatus: statusStats,
        recentUsers
      };
    } catch (error) {
      logger.error('Erreur récupération statistiques:', error);
      throw error;
    }
  }

  // Définir le mot de passe avec le token
  async setPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    try {
      // Hasher le token pour comparer
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // Trouver l'utilisateur avec le token valide
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new AppError('Token invalide ou expiré', 400);
      }

      // Hasher et définir le nouveau mot de passe
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.mustChangePassword = false;
      user.statut = 'actif'; // Activer le compte
      
      await user.save();

      logger.info(`Mot de passe défini pour: ${user.email}`);
      return true;
    } catch (error) {
      logger.error('Erreur définition mot de passe:', error);
      throw error;
    }
  }
}

export default new UserService();
