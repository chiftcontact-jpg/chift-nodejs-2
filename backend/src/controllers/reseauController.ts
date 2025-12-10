import { Response, NextFunction } from 'express';
import Reseau from '../models/Reseau';
import logger from '../utils/logger';
import { AuthRequest } from '../middlewares/auth';

export const getReseaux = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, departement, commune, statut } = req.query;

    const filter: any = {};

    if (region) filter.region = region;
    if (departement) filter.departement = departement;
    if (commune) filter.commune = commune;
    if (statut) filter.statut = statut;

    const reseaux = await Reseau.find(filter)
      .populate('caisses', 'nom numero')
      .populate('president.agent', 'nom prenom')
      .sort({ dateCreation: -1 });

    res.json({
      success: true,
      count: reseaux.length,
      data: reseaux
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des réseaux:', error);
    next(error);
  }
};

export const getReseauById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const reseau = await Reseau.findById(id)
      .populate('caisses', 'nom numero statut totalMembres')
      .populate('president.agent', 'nom prenom telephone email')
      .populate('membres.agent', 'nom prenom telephone email');

    if (!reseau) {
      return res.status(404).json({
        success: false,
        message: 'Réseau non trouvé'
      });
    }

    res.json({
      success: true,
      data: reseau
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du réseau:', error);
    next(error);
  }
};

export const createReseau = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      nom,
      region,
      departement,
      commune,
      presidentId,
      presidentNom,
      description
    } = req.body;

    const reseau = await Reseau.create({
      nom,
      region,
      departement,
      commune,
      president: {
        agent: presidentId,
        nom: presidentNom,
        dateNomination: new Date()
      },
      description,
      statut: 'active',
      membres: [{
        agent: presidentId,
        role: 'president',
        dateAdhesion: new Date()
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Réseau créé avec succès',
      data: reseau
    });
  } catch (error) {
    logger.error('Erreur lors de la création du réseau:', error);
    next(error);
  }
};

export const updateReseau = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reseau = await Reseau.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!reseau) {
      return res.status(404).json({
        success: false,
        message: 'Réseau non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Réseau mis à jour avec succès',
      data: reseau
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du réseau:', error);
    next(error);
  }
};

export const deleteReseau = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const reseau = await Reseau.findByIdAndDelete(id);

    if (!reseau) {
      return res.status(404).json({
        success: false,
        message: 'Réseau non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Réseau supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur lors de la suppression du réseau:', error);
    next(error);
  }
};

export const addCaisseToReseau = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { caisseId } = req.body;

    const reseau = await Reseau.findById(id);

    if (!reseau) {
      return res.status(404).json({
        success: false,
        message: 'Réseau non trouvé'
      });
    }

    // Vérifier si la caisse existe déjà
    const caisseExists = reseau.caisses.some(
      caisse => caisse.toString() === caisseId
    );

    if (caisseExists) {
      return res.status(400).json({
        success: false,
        message: 'Cette caisse fait déjà partie du réseau'
      });
    }

    reseau.caisses.push(caisseId);
    reseau.nombreCaisses = reseau.caisses.length;
    await reseau.save();

    res.json({
      success: true,
      message: 'Caisse ajoutée au réseau avec succès',
      data: reseau
    });
  } catch (error) {
    logger.error('Erreur lors de l\'ajout de la caisse au réseau:', error);
    next(error);
  }
};

export const removeCaisseFromReseau = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, caisseId } = req.params;

    const reseau = await Reseau.findById(id);

    if (!reseau) {
      return res.status(404).json({
        success: false,
        message: 'Réseau non trouvé'
      });
    }

    reseau.caisses = reseau.caisses.filter(
      caisse => caisse.toString() !== caisseId
    );

    reseau.nombreCaisses = reseau.caisses.length;
    await reseau.save();

    res.json({
      success: true,
      message: 'Caisse retirée du réseau avec succès',
      data: reseau
    });
  } catch (error) {
    logger.error('Erreur lors du retrait de la caisse du réseau:', error);
    next(error);
  }
};

export const addMembreToReseau = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { agentId, role } = req.body;

    const reseau = await Reseau.findById(id);

    if (!reseau) {
      return res.status(404).json({
        success: false,
        message: 'Réseau non trouvé'
      });
    }

    // Vérifier si le membre existe déjà
    const membreExists = reseau.membres.some(
      membre => membre.agent.toString() === agentId
    );

    if (membreExists) {
      return res.status(400).json({
        success: false,
        message: 'Ce membre fait déjà partie du réseau'
      });
    }

    reseau.membres.push({
      agent: agentId,
      role: role || 'membre',
      dateAdhesion: new Date()
    });

    await reseau.save();

    res.json({
      success: true,
      message: 'Membre ajouté au réseau avec succès',
      data: reseau
    });
  } catch (error) {
    logger.error('Erreur lors de l\'ajout du membre au réseau:', error);
    next(error);
  }
};
