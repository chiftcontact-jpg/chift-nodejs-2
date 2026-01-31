import Caisse from '../models/Caisse';
import logger from '../utils/logger';
import { REGIONS_CODES, DEPARTEMENTS_CODES } from '../utils/geoCodes';

export class CaisseService {
  // Générer un code unique pour la caisse selon la nouvelle codification
  private async generateCaisseCode(data: any): Promise<string> {
    const { type, region, departement, commune } = data;
    
    const regionKey = (region || '').toUpperCase();
    const deptKey = (departement || '').toUpperCase();
    
    const rCode = REGIONS_CODES[regionKey as keyof typeof REGIONS_CODES] || '0';
    const dCode = DEPARTEMENTS_CODES[deptKey as keyof typeof DEPARTEMENTS_CODES] || '000';
    
    // Pour la commune, on va chercher le nombre de caisses existantes dans cette commune
    const communePrefix = commune ? commune.substring(0, 3).toUpperCase() : 'XXX';
    
    // Trouver le nombre de caisses dans cette région, département et commune pour l'ordre d'arrivée
    const count = await Caisse.countDocuments({
      region: region,
      departement: departement,
      commune: commune
    });
    
    const order = String(count + 1).padStart(3, '0');
    
    // Code format: TYPE-R-DEPT-COMM-ORDER (ex: CLS-1-101-DAK-001)
    const typePrefix = type === 'LEKKET' ? 'LEK' : 'CLS';
    return `${typePrefix}-${rCode}-${dCode}-${communePrefix}-${order}`;
  }

  // Créer une caisse
  async createCaisse(data: any) {
    try {
      // Mapper les codes géographiques
      data.regionCode = REGIONS_CODES[data.region.toUpperCase() as keyof typeof REGIONS_CODES] || '0';
      data.departementCode = DEPARTEMENTS_CODES[data.departement.toUpperCase() as keyof typeof DEPARTEMENTS_CODES] || '000';
      
      // Générer le code si non fourni
      if (!data.code) {
        data.code = await this.generateCaisseCode(data);
      }

      // Mapper montantCotisation vers montantMinimumCotisation si nécessaire
      if (data.montantCotisation !== undefined && data.montantMinimumCotisation === undefined) {
        data.montantMinimumCotisation = data.montantCotisation;
        delete data.montantCotisation;
      }
      
      // Valeur par défaut pour montantMinimumCotisation si non fourni
      if (data.montantMinimumCotisation === undefined) {
        data.montantMinimumCotisation = 0;
      }
      
      const caisse = await Caisse.create(data);
      logger.info(`Caisse créée: ${caisse.code}`);
      return caisse;
    } catch (error) {
      logger.error('Erreur création caisse:', error);
      throw error;
    }
  }

  // Récupérer toutes les caisses avec filtres
  async getAllCaisses(filters: {
    region?: string;
    departement?: string;
    commune?: string;
    statut?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        region,
        departement,
        commune,
        statut,
        type,
        page = 1,
        limit = 10
      } = filters;

      const query: any = {};
      
      if (region) query.region = region;
      if (departement) query.departement = departement;
      if (commune) query.commune = commune;
      if (statut) query.statut = statut;
      if (type) query.type = type;

      const skip = (page - 1) * limit;

      const [caisses, total] = await Promise.all([
        Caisse.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Caisse.countDocuments(query)
      ]);

      return {
        caisses,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération caisses:', error);
      throw error;
    }
  }

  // Récupérer une caisse par ID
  async getCaisseById(id: string) {
    try {
      const caisse = await Caisse.findById(id).lean();
      if (!caisse) {
        throw new Error('Caisse non trouvée');
      }
      return caisse;
    } catch (error) {
      logger.error('Erreur récupération caisse:', error);
      throw error;
    }
  }

  // Mettre à jour une caisse
  async updateCaisse(id: string, data: any) {
    try {
      const caisse = await Caisse.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!caisse) {
        throw new Error('Caisse non trouvée');
      }

      logger.info(`Caisse mise à jour: ${caisse.code}`);
      return caisse;
    } catch (error) {
      logger.error('Erreur mise à jour caisse:', error);
      throw error;
    }
  }

  // Supprimer une caisse
  async deleteCaisse(id: string) {
    try {
      const caisse = await Caisse.findByIdAndDelete(id);
      
      if (!caisse) {
        throw new Error('Caisse non trouvée');
      }

      logger.info(`Caisse supprimée: ${caisse.code}`);
      return true;
    } catch (error) {
      logger.error('Erreur suppression caisse:', error);
      throw error;
    }
  }

  // Statistiques
  async getStatistics() {
    try {
      const [total, byType, byStatut, byRegion] = await Promise.all([
        Caisse.countDocuments(),
        Caisse.aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]),
        Caisse.aggregate([
          { $group: { _id: '$statut', count: { $sum: 1 } } }
        ]),
        Caisse.aggregate([
          { $group: { _id: '$region', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ])
      ]);

      const stats = {
        total,
        byType: byType.reduce((acc: any, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        byStatut: byStatut.reduce((acc: any, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        topRegions: byRegion
      };

      return stats;
    } catch (error) {
      logger.error('Erreur statistiques:', error);
      throw error;
    }
  }
}

export default new CaisseService();
