import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from './errorHandler';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Non autorisé - Aucun token fourni', 401);
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      if (user.statut !== 'actif') {
        throw new AppError('Compte inactif ou suspendu', 403);
      }

      req.user = user;
      next();
    } catch (error) {
      throw new AppError('Token invalide', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Non autorisé', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Accès interdit - Permissions insuffisantes', 403);
    }

    next();
  };
};
