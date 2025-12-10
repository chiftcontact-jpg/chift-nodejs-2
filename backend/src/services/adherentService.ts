import Adhérent, { IAdhérent } from '../models/Adherent';
import { AppError } from '../middlewares/errorHandler';
import logger from '../utils/logger';

class AdhérentService {
  /**
   * Génère un numéro unique d'adhérent
   */
  private async genererNumeroAdherent(): Promise<string> {
    const count = await Adhérent.countDocuments();
    const numero = `ADH${String(count + 1).padStart(8, '0')}`;
    return numero;
  }

  /**
   * Génère un numéro de compte CHIFT
   */
  private async genererNumeroCompteChift(): Promise<string> {
    const count = await Adhérent.countDocuments();
    const numero = `CHIFT${String(count + 1).padStart(10, '0')}`;
    return numero;
  }

  /**
   * Génère un numéro CSU
   */
  private async genererNumeroCSU(): Promise<string> {
    const count = await Adhérent.countDocuments();
    const numero = `CSU${String(count + 1).padStart(10, '0')}`;
    return numero;
  }

  /**
   * Crée un nouvel adhérent
   */
  async creerAdherent(data: any): Promise<IAdhérent> {
    try {
      // Génération des numéros
      const numeroAdherent = await this.genererNumeroAdherent();
      const numeroCompte = await this.genererNumeroCompteChift();
      const numeroCSU = await this.genererNumeroCSU();

      const adherent = await Adhérent.create({
        ...data,
        numeroAdherent,
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

      logger.info(`Nouvel adhérent créé: ${adherent.numeroAdherent}`);
      return adherent;
    } catch (error: any) {
      logger.error('Erreur création adhérent:', error);
      throw new AppError(error.message, 400);
    }
  }

  /**
   * Récupère un adhérent par ID
   */
  async getAdherentById(id: string): Promise<IAdhérent> {
    const adherent = await Adhérent.findById(id)
      .populate('communauteId')
      .populate('agentCollecteId')
      .populate('makerId');

    if (!adherent) {
      throw new AppError('Adhérent non trouvé', 404);
    }

    return adherent;
  }

  /**
   * Liste tous les adhérents avec filtres
   */
  async listerAdherents(filters: any = {}): Promise<IAdhérent[]> {
    const query: any = {};

    if (filters.statut) query.statut = filters.statut;
    if (filters.typeAdherent) query.typeAdherent = filters.typeAdherent;
    if (filters.region) query.region = filters.region;
    if (filters.communauteId) query.communauteId = filters.communauteId;

    const adherents = await Adhérent.find(query)
      .populate('communauteId')
      .populate('agentCollecteId')
      .sort({ createdAt: -1 });

    return adherents;
  }

  /**
   * Met à jour un adhérent
   */
  async mettreAJourAdherent(id: string, data: any): Promise<IAdhérent> {
    const adherent = await Adhérent.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    if (!adherent) {
      throw new AppError('Adhérent non trouvé', 404);
    }

    logger.info(`Adhérent mis à jour: ${adherent.numeroAdherent}`);
    return adherent;
  }

  /**
   * Attribue une carte NFC
   */
  async attribuerCarteNFC(
    adherentId: string,
    numeroSerie: string,
    mutuelleRecuperation: string
  ): Promise<IAdhérent> {
    const adherent = await Adhérent.findByIdAndUpdate(
      adherentId,
      {
        carteNFC: {
          numeroSerie,
          dateEmission: new Date(),
          dateRecuperation: new Date(),
          mutuelleRecuperation,
          statut: 'active'
        }
      },
      { new: true }
    );

    if (!adherent) {
      throw new AppError('Adhérent non trouvé', 404);
    }

    logger.info(`Carte NFC attribuée à: ${adherent.numeroAdherent}`);
    return adherent;
  }

  /**
   * Recherche adhérents
   */
  async rechercherAdherents(searchTerm: string): Promise<IAdhérent[]> {
    const adherents = await Adhérent.find({
      $or: [
        { nom: { $regex: searchTerm, $options: 'i' } },
        { prenom: { $regex: searchTerm, $options: 'i' } },
        { telephone: { $regex: searchTerm, $options: 'i' } },
        { numeroAdherent: { $regex: searchTerm, $options: 'i' } },
        { 'compteChift.numeroCompte': { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(20);

    return adherents;
  }
}

export default new AdhérentService();
