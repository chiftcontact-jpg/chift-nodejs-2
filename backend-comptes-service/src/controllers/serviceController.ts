import { Request, Response } from 'express';
import Service from '../models/Service';
import logger from '../utils/logger';

export const getUserServices = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const services = await Service.find({ userId }).populate('comptesAssocies');
    res.json({ success: true, data: services });
  } catch (error) {
    logger.error('Erreur getUserServices:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    logger.error('Erreur createService:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const addCompteToService = async (req: Request, res: Response) => {
  try {
    const { serviceId, compteId } = req.body;
    const service = await Service.findByIdAndUpdate(
      serviceId,
      { $addToSet: { comptesAssocies: compteId } },
      { new: true }
    );
    res.json({ success: true, data: service });
  } catch (error) {
    logger.error('Erreur addCompteToService:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
