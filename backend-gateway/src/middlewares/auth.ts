import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    roles?: any[];
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Tentative d\'accès sans token', {
        ip: req.ip,
        path: req.path,
      });
      return res.status(401).json({
        success: false,
        message: 'Token manquant ou invalide',
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      email: string;
      role: string;
      roles?: any[];
    };

    req.user = decoded;

    logger.info('Authentification réussie', {
      userId: decoded.userId,
      role: decoded.role,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error('Erreur d\'authentification', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
    });

    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Accès refusé - rôle insuffisant', {
        userId: req.user.userId,
        role: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path,
      });

      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Permissions insuffisantes',
      });
    }

    next();
  };
};
