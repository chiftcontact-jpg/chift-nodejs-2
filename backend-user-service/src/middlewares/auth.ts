import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string; // rolePrincipal pour compatibilité
    roles?: Array<{ role: string; caisseId?: string; actif: boolean }>;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token manquant ou invalide'
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
      return;
    }

    // Vérifier le rôle principal
    const hasRolePrincipal = roles.includes(req.user.role);
    
    // Vérifier dans les rôles multiples
    const hasRoleInRoles = req.user.roles?.some(
      r => roles.includes(r.role) && r.actif
    ) || false;

    if (!hasRolePrincipal && !hasRoleInRoles) {
      res.status(403).json({
        success: false,
        message: 'Accès refusé - permissions insuffisantes'
      });
      return;
    }

    next();
  };
};
