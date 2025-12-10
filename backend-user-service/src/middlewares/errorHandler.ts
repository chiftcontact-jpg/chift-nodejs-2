import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import config from '../config';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Erreur:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(config.env === 'development' && { stack: err.stack })
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    ...(config.env === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route non trouvée - ${req.originalUrl}`, 404);
  next(error);
};
