import { Response, NextFunction, Request } from 'express';
import Agent from '../models/Agent';
import logger from '../utils/logger';
import { AuthRequest } from '../middlewares/auth';

export const getProfilAgent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer l'ID de l'agent depuis le token (ajouté par le middleware auth)
    const agentId = req.user?.id;

    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        id: agent._id,
        nom: agent.nom,
        prenom: agent.prenom,
        numeroAgent: agent.numeroAgent,
        telephone: agent.telephone,
        email: agent.email,
        adresse: agent.adresse,
        region: agent.region,
        departement: agent.departement,
        commune: agent.commune,
        dateNaissance: agent.dateNaissance,
        groupeSanguin: agent.groupeSanguin,
        dateAdhesion: agent.dateAdhesion,
        lieuAdhesion: agent.lieuAdhesion,
        statut: agent.statut,
        typeAgent: agent.typeAgent,
        services: agent.services,
        csu: agent.csu,
        nombreUtilisateursRecrutés: agent.nombreUtilisateursRecrutés,
        createdAt: agent.createdAt
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du profil agent:', error);
    next(error);
  }
};

export const updateProfilAgent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const agentId = req.user?.id;

    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    const {
      email,
      adresse,
      telephone,
      groupeSanguin
    } = req.body;

    const agent = await Agent.findByIdAndUpdate(
      agentId,
      {
        ...(email && { email }),
        ...(adresse && { adresse }),
        ...(telephone && { telephone }),
        ...(groupeSanguin && { groupeSanguin })
      },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: agent
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du profil agent:', error);
    next(error);
  }
};

export const activerService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const agentId = req.user?.id;
    const { service } = req.params; // leket, sokhla, natt, condamne, leeb

    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    const servicesValides = ['leket', 'sokhla', 'natt', 'condamne', 'leeb'];
    if (!servicesValides.includes(service)) {
      return res.status(400).json({
        success: false,
        message: 'Service invalide'
      });
    }

    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent non trouvé'
      });
    }

    // Initialiser services si undefined
    if (!agent.services) {
      agent.services = {
        leket: { actif: false },
        sokhla: { actif: false },
        natt: { actif: false },
        condamne: { actif: false },
        leeb: { actif: false }
      };
    }

    // Activer le service
    agent.services[service as keyof typeof agent.services] = {
      actif: true,
      dateActivation: new Date()
    };

    await agent.save();

    res.json({
      success: true,
      message: `Service ${service.toUpperCase()} activé avec succès`,
      data: agent.services
    });
  } catch (error) {
    logger.error('Erreur lors de l\'activation du service:', error);
    next(error);
  }
};

export const activerCSU = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const agentId = req.user?.id;
    const { numeroCSU } = req.body;

    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent non trouvé'
      });
    }

    agent.csu = {
      actif: true,
      numeroCSU: numeroCSU || `CSU-${agent.numeroAgent}`,
      dateActivation: new Date()
    };

    await agent.save();

    res.json({
      success: true,
      message: 'CSU activé avec succès',
      data: agent.csu
    });
  } catch (error) {
    logger.error('Erreur lors de l\'activation du CSU:', error);
    next(error);
  }
};

// Récupérer tous les agents
export const getAllAgents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { statut, search } = req.query;

    const filter: any = {};
    
    if (statut) {
      filter.statut = statut;
    }

    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { numeroAgent: { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } }
      ];
    }

    const agents = await Agent.find(filter)
      .select('nom prenom numeroAgent telephone email statut typeAgent region departement commune')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des agents:', error);
    next(error);
  }
};

// Créer un nouvel agent
export const createAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      nom,
      prenom,
      telephone,
      email,
      whatsapp,
      cni
    } = req.body;

    // Validation des champs obligatoires
    if (!nom || !prenom || !telephone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nom, prénom, téléphone et email sont obligatoires'
      });
    }

    // Vérifier si l'agent existe déjà
    const existingAgent = await Agent.findOne({
      $or: [{ email }, { telephone }]
    });

    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Un agent avec cet email ou téléphone existe déjà'
      });
    }

    // Générer un numéro d'agent unique
    const lastAgent = await Agent.findOne().sort({ numeroAgent: -1 });
    let numeroAgent = 'AGT-0001';
    
    if (lastAgent && lastAgent.numeroAgent) {
      const lastNumber = parseInt(lastAgent.numeroAgent.split('-')[1]);
      numeroAgent = `AGT-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    const agent = await Agent.create({
      nom,
      prenom,
      telephone,
      email,
      numeroAgent,
      whatsapp: whatsapp || telephone,
      cni,
      statut: 'actif',
      typeAgent: 'standard',
      dateAdhesion: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Agent créé avec succès',
      data: agent
    });
  } catch (error) {
    logger.error('Erreur lors de la création de l\'agent:', error);
    next(error);
  }
};
