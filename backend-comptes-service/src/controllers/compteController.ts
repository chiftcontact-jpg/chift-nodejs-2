import { Request, Response } from 'express';
import Compte from '../models/Compte';
import logger from '../utils/logger';

export const getUserComptes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const comptes = await Compte.find({ userId });
    res.json({ success: true, data: comptes });
  } catch (error) {
    logger.error('Erreur getUserComptes:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const createCompte = async (req: Request, res: Response) => {
  try {
    const newCompte = new Compte(req.body);
    await newCompte.save();
    res.status(201).json({ success: true, data: newCompte });
  } catch (error) {
    logger.error('Erreur createCompte:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const updateCompteStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const compte = await Compte.findByIdAndUpdate(id, { statut }, { new: true });
    res.json({ success: true, data: compte });
  } catch (error) {
    logger.error('Erreur updateCompteStatus:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
