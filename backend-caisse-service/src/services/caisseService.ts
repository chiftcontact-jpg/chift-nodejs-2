import Caisse from '../models/Caisse';
import logger from '../utils/logger';

export class CaisseService {
  // Générer un code unique pour la caisse
  private async generateCaisseCode(type: string, region: string): Promise<string> {
    const prefix = type === 'LEKKET' ? 'LEK' : 'CLS';
    const regionCode = region.substring(0, 3).toUpperCase();
    
    // Trouver le dernier numéro utilisé pour ce préfixe
    const pattern = new RegExp(`^${prefix}-${regionCode}-(\\d+)$`);
    const lastCaisse = await Caisse.findOne({ 
      code: pattern 
    })
      .sort({ code: -1 })
      .limit(1)
      .lean();
    
    let nextNumber = 1;
    if (lastCaisse && lastCaisse.code) {
      const match = lastCaisse.code.match(pattern);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    
    // En cas de collision, essayer les numéros suivants
    let code = `${prefix}-${regionCode}-${String(nextNumber).padStart(4, '0')}`;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      const exists = await Caisse.findOne({ code }).lean();
      if (!exists) {
        return code;
      }
      nextNumber++;
      code = `${prefix}-${regionCode}-${String(nextNumber).padStart(4, '0')}`;
      attempts++;
    }
    
    // Si on arrive ici, générer un code avec timestamp pour garantir l'unicité
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${regionCode}-${timestamp}`;
  }

  // Créer une caisse
  async createCaisse(data: any) {
    try {
      // Mapper montantCotisation vers montantMinimumCotisation si nécessaire
      if (data.montantCotisation !== undefined && data.montantMinimumCotisation === undefined) {
        data.montantMinimumCotisation = data.montantCotisation;
        delete data.montantCotisation;
      }
      
      // Valeur par défaut pour montantMinimumCotisation si non fourni
      if (data.montantMinimumCotisation === undefined) {
        data.montantMinimumCotisation = 0;
      }
      
      // Générer le code si non fourni
      if (!data.code) {
        data.code = await this.generateCaisseCode(
          data.type || 'CLASSIQUE',
          data.region
        );
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
