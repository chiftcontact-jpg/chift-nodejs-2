import Souscription, { ISouscription } from '../models/Souscription';
import AdhérentService from './adherentService';
import Agent from '../models/Agent';
import Maker from '../models/Maker';
import Communaute from '../models/Communaute';
import { AppError } from '../middlewares/errorHandler';
import logger from '../utils/logger';

class SouscriptionService {
  /**
   * Génère un numéro unique de souscription
   */
  private async genererNumeroSouscription(): Promise<string> {
    const count = await Souscription.countDocuments();
    const numero = `SOUSCR${String(count + 1).padStart(8, '0')}`;
    return numero;
  }

  /**
   * Crée une nouvelle souscription
   */
  async creerSouscription(data: any): Promise<ISouscription> {
    try {
      const numeroSouscription = await this.genererNumeroSouscription();

      // Validation des références
      if (data.agentCollecteId) {
        const agent = await Agent.findById(data.agentCollecteId);
        if (!agent) {
          throw new AppError('Agent de collecte non trouvé', 404);
        }
      }

      if (data.makerId) {
        const maker = await Maker.findById(data.makerId);
        if (!maker) {
          throw new AppError('Maker non trouvé', 404);
        }
      }

      if (data.communauteId) {
        const communaute = await Communaute.findById(data.communauteId);
        if (!communaute) {
          throw new AppError('Communauté non trouvée', 404);
        }
      }

      const souscription = await Souscription.create({
        ...data,
        numeroSouscription,
        statut: 'en_cours',
        etapeActuelle: 'collecte',
        historique: [
          {
            action: 'Création de la souscription',
            utilisateur: data.agentCollecteId || data.makerId || 'Système',
            date: new Date(),
            details: 'Souscription initiée'
          }
        ]
      });

      logger.info(`Nouvelle souscription créée: ${souscription.numeroSouscription}`);
      return souscription;
    } catch (error: any) {
      logger.error('Erreur création souscription:', error);
      throw new AppError(error.message, 400);
    }
  }

  /**
   * Traite l'enrôlement d'un adhérent à partir d'une souscription
   */
  async traiterEnrolement(souscriptionId: string, dataAdherent: any): Promise<any> {
    try {
      const souscription = await Souscription.findById(souscriptionId);

      if (!souscription) {
        throw new AppError('Souscription non trouvée', 404);
      }

      if (souscription.statut !== 'en_cours') {
        throw new AppError('Cette souscription ne peut plus être traitée', 400);
      }

      // Créer l'adhérent
      const adherent = await AdhérentService.creerAdherent({
        ...dataAdherent,
        typeAdherent: souscription.typeSouscription === 'individuelle' ? 'individuel' : 'communautaire',
        communauteId: souscription.communauteId,
        agentCollecteId: souscription.agentCollecteId,
        makerId: souscription.makerId,
        mecanismeEndogene: souscription.questionnaire.possedeMecanismeEndogene
          ? {
              type: souscription.questionnaire.typeMecanisme || 'autre'
            }
          : { type: 'aucun' }
      });

      // Mettre à jour la souscription
      souscription.adherentId = adherent._id as any;
      souscription.etapeActuelle = 'enrolement';
      souscription.dateEnrolement = new Date();
      souscription.historique.push({
        action: 'Enrôlement complété',
        utilisateur: souscription.agentCollecteId?.toString() || 'Système',
        date: new Date(),
        details: `Adhérent créé: ${adherent.numeroAdherent}`
      });

      await souscription.save();

      // Incrémenter le compteur de l'agent
      if (souscription.agentCollecteId) {
        await Agent.findByIdAndUpdate(souscription.agentCollecteId, {
          $inc: { nombreAdhérentsRecrutés: 1 }
        });
      }

      logger.info(`Enrôlement traité pour souscription: ${souscription.numeroSouscription}`);

      return {
        souscription,
        adherent
      };
    } catch (error: any) {
      logger.error('Erreur traitement enrôlement:', error);
      throw new AppError(error.message, 400);
    }
  }

  /**
   * Valide une souscription
   */
  async validerSouscription(souscriptionId: string, validateurId: string): Promise<ISouscription> {
    const souscription = await Souscription.findById(souscriptionId);

    if (!souscription) {
      throw new AppError('Souscription non trouvée', 404);
    }

    souscription.etapeActuelle = 'validation';
    souscription.dateValidation = new Date();
    souscription.historique.push({
      action: 'Validation',
      utilisateur: validateurId,
      date: new Date()
    });

    await souscription.save();

    logger.info(`Souscription validée: ${souscription.numeroSouscription}`);
    return souscription;
  }

  /**
   * Active une souscription (étape finale)
   */
  async activerSouscription(
    souscriptionId: string,
    mutuelleAssignee: string
  ): Promise<ISouscription> {
    const souscription = await Souscription.findById(souscriptionId);

    if (!souscription) {
      throw new AppError('Souscription non trouvée', 404);
    }

    souscription.statut = 'completée';
    souscription.etapeActuelle = 'terminée';
    souscription.dateActivation = new Date();
    souscription.mutuelleAssignee = mutuelleAssignee;
    souscription.historique.push({
      action: 'Activation',
      utilisateur: 'Système',
      date: new Date(),
      details: `Mutuelle assignée: ${mutuelleAssignee}`
    });

    await souscription.save();

    // Mettre à jour l'adhérent avec la mutuelle
    if (souscription.adherentId) {
      await AdhérentService.mettreAJourAdherent(souscription.adherentId.toString(), {
        mutuelleProche: mutuelleAssignee
      });
    }

    logger.info(`Souscription activée: ${souscription.numeroSouscription}`);
    return souscription;
  }

  /**
   * Liste les souscriptions avec filtres
   */
  async listerSouscriptions(filters: any = {}): Promise<ISouscription[]> {
    const query: any = {};

    if (filters.statut) query.statut = filters.statut;
    if (filters.etapeActuelle) query.etapeActuelle = filters.etapeActuelle;
    if (filters.typeSouscription) query.typeSouscription = filters.typeSouscription;
    if (filters.agentCollecteId) query.agentCollecteId = filters.agentCollecteId;

    const souscriptions = await Souscription.find(query)
      .populate('adherentId')
      .populate('agentCollecteId')
      .populate('makerId')
      .populate('communauteId')
      .sort({ createdAt: -1 });

    return souscriptions;
  }

  /**
   * Récupère une souscription par ID
   */
  async getSouscriptionById(id: string): Promise<ISouscription> {
    const souscription = await Souscription.findById(id)
      .populate('adherentId')
      .populate('agentCollecteId')
      .populate('makerId')
      .populate('communauteId');

    if (!souscription) {
      throw new AppError('Souscription non trouvée', 404);
    }

    return souscription;
  }
}

export default new SouscriptionService();
