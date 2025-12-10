import { Response, NextFunction } from 'express';
import Caisse from '../models/Caisse';
import logger from '../utils/logger';
import { AuthRequest } from '../middlewares/auth';

export const getCaisses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, departement, commune, statut, search } = req.query;

    const filter: any = {};

    if (region) filter.region = region;
    if (departement) filter.departement = departement;
    if (commune) filter.commune = commune;
    if (statut) filter.statut = statut;

    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { numero: { $regex: search, $options: 'i' } }
      ];
    }

    const caisses = await Caisse.find(filter)
      .populate('communaute', 'nom')
      .populate('makers.agent', 'nom prenom')
      .sort({ dateCreation: -1 });

    res.json({
      success: true,
      count: caisses.length,
      data: caisses
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des caisses:', error);
    next(error);
  }
};

export const getCaisseById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const caisse = await Caisse.findById(id)
      .populate('communaute', 'nom region departement commune')
      .populate('makers.agent', 'nom prenom telephone email');

    if (!caisse) {
      return res.status(404).json({
        success: false,
        message: 'Caisse non trouvée'
      });
    }

    res.json({
      success: true,
      data: caisse
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération de la caisse:', error);
    next(error);
  }
};

export const createCaisse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      nom,
      communaute,
      badge,
      frequence,
      jour,
      montantCotisation,
      region,
      departement,
      commune
    } = req.body;

    // Générer le numéro de caisse
    const count = await Caisse.countDocuments({ commune });
    const numero = `#100-101-${commune.toUpperCase()}-${String(count + 1).padStart(4, '0')}`;

    const caisse = await Caisse.create({
      nom,
      numero,
      communaute,
      badge,
      frequence,
      jour,
      montantCotisation,
      region,
      departement,
      commune,
      statut: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Caisse créée avec succès',
      data: caisse
    });
  } catch (error) {
    logger.error('Erreur lors de la création de la caisse:', error);
    next(error);
  }
};

export const updateCaisse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const caisse = await Caisse.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!caisse) {
      return res.status(404).json({
        success: false,
        message: 'Caisse non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Caisse mise à jour avec succès',
      data: caisse
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de la caisse:', error);
    next(error);
  }
};

export const deleteCaisse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const caisse = await Caisse.findByIdAndDelete(id);

    if (!caisse) {
      return res.status(404).json({
        success: false,
        message: 'Caisse non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Caisse supprimée avec succès'
    });
  } catch (error) {
    logger.error('Erreur lors de la suppression de la caisse:', error);
    next(error);
  }
};

export const addMaker = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { agentId, nom } = req.body;

    const caisse = await Caisse.findById(id);

    if (!caisse) {
      return res.status(404).json({
        success: false,
        message: 'Caisse non trouvée'
      });
    }

    // Vérifier si le maker existe déjà
    const makerExists = caisse.makers.some(
      maker => maker.agent.toString() === agentId
    );

    if (makerExists) {
      return res.status(400).json({
        success: false,
        message: 'Ce maker est déjà assigné à cette caisse'
      });
    }

    caisse.makers.push({
      agent: agentId,
      nom,
      dateAssignation: new Date()
    });

    await caisse.save();

    res.json({
      success: true,
      message: 'Maker ajouté avec succès',
      data: caisse
    });
  } catch (error) {
    logger.error('Erreur lors de l\'ajout du maker:', error);
    next(error);
  }
};

export const removeMaker = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, makerId } = req.params;

    const caisse = await Caisse.findById(id);

    if (!caisse) {
      return res.status(404).json({
        success: false,
        message: 'Caisse non trouvée'
      });
    }

    caisse.makers = caisse.makers.filter(
      maker => maker.agent.toString() !== makerId
    );

    await caisse.save();

    res.json({
      success: true,
      message: 'Maker retiré avec succès',
      data: caisse
    });
  } catch (error) {
    logger.error('Erreur lors du retrait du maker:', error);
    next(error);
  }
};
