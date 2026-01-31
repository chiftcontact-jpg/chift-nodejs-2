import Utilisateur, { IUtilisateur } from '../models/Utilisateur';
import { AppError } from '../middlewares/errorHandler';
import logger from '../utils/logger';

class UtilisateurService {
  /**
   * Génère un numéro unique d'utilisateur
   */
  private async genererNumeroUtilisateur(): Promise<string> {
    const count = await Utilisateur.countDocuments();
    const numero = `USR${String(count + 1).padStart(8, '0')}`;
    return numero;
  }

  /**
   * Génère un numéro de compte CHIFT
   */
  private async genererNumeroCompteChift(): Promise<string> {
    const count = await Utilisateur.countDocuments();
    const numero = `CHIFT${String(count + 1).padStart(10, '0')}`;
    return numero;
  }

  /**
   * Génère un numéro CSU
   */
  private async genererNumeroCSU(): Promise<string> {
    const count = await Utilisateur.countDocuments();
    const numero = `CSU${String(count + 1).padStart(10, '0')}`;
    return numero;
  }

  /**
   * Crée un nouvel utilisateur
   */
  async creerUtilisateur(data: any): Promise<IUtilisateur> {
    try {
      // Génération des numéros
      const numeroUtilisateur = await this.genererNumeroUtilisateur();
      const numeroCompte = await this.genererNumeroCompteChift();
      const numeroCSU = await this.genererNumeroCSU();

      const utilisateur = await Utilisateur.create({
        ...data,
        numeroUtilisateur,
        compteChift: {
          numeroCompte,
          solde: 0,
          dateOuverture: new Date(),
          statut: 'actif'
        },
        csu: {
          numeroCSU,
          dateActivation: new Date(),
          statut: 'actif'
        },
        accesCredit: {
          nano: true,
          micro: true,
          historiqueDemandes: 0
        },
        accesMobileMoney: true
      });

      logger.info(`Nouvel utilisateur créé: ${utilisateur.numeroUtilisateur}`);
      return utilisateur;
    } catch (error: any) {
      logger.error('Erreur création utilisateur:', error);
      throw new AppError(error.message, 400);
    }
  }

  /**
   * Récupère un utilisateur par ID
   */
  async getUtilisateurById(id: string): Promise<IUtilisateur> {
    const utilisateur = await Utilisateur.findById(id)
      .populate('communauteId')
      .populate('agentCollecteId')
      .populate('makerId');

    if (!utilisateur) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    return utilisateur;
  }

  /**
   * Liste tous les utilisateurs avec filtres
   */
  async listerUtilisateurs(filters: any = {}): Promise<IUtilisateur[]> {
    const query: any = {};

    if (filters.statut) query.statut = filters.statut;
    if (filters.typeUtilisateur) query.typeUtilisateur = filters.typeUtilisateur;
    if (filters.region) query.region = filters.region;
    if (filters.communauteId) query.communauteId = filters.communauteId;

    const utilisateurs = await Utilisateur.find(query)
      .populate('communauteId')
      .populate('agentCollecteId')
      .populate('makerId')
      .sort({ createdAt: -1 });

    return utilisateurs;
  }

  /**
   * Met à jour un utilisateur
   */
  async mettreAJourUtilisateur(id: string, data: any): Promise<IUtilisateur> {
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!utilisateur) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    return utilisateur;
  }

  /**
   * Attribue une carte NFC à un utilisateur
   */
  async attribuerCarteNFC(id: string, numeroSerie: string, mutuelle: string): Promise<IUtilisateur> {
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      id,
      {
        $set: {
          carteNFCRemise: true,
          dateRemiseCarteNFC: new Date(),
          mutuelleAssignee: mutuelle,
          'carteNFC.numeroSerie': numeroSerie
        }
      },
      { new: true }
    );

    if (!utilisateur) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    return utilisateur;
  }

  /**
   * Recherche d'utilisateurs
   */
  async rechercherUtilisateurs(searchTerm: string): Promise<IUtilisateur[]> {
    const searchRegex = new RegExp(searchTerm, 'i');
    
    return await Utilisateur.find({
      $or: [
        { nom: searchRegex },
        { prenom: searchRegex },
        { telephone: searchRegex },
        { numeroUtilisateur: searchRegex }
      ]
    });
  }
}

export default new UtilisateurService();