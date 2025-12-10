import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Erreur non gérée', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
};

export const notFound = (req: Request, res: Response) => {
  logger.warn('Route non trouvée', {
    path: req.path,
    method: req.method,
  });

  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
};
