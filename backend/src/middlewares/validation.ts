import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      throw new AppError(message, 400);
    }

    next();
  };
};

// Schémas de validation courants
export const schemas = {
  // Agent
  createAgent: Joi.object({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    telephone: Joi.string().pattern(/^[0-9]{9,15}$/).required(),
    email: Joi.string().email().optional(),
    cni: Joi.string().required(),
    adresse: Joi.string().required(),
    region: Joi.string().required(),
    departement: Joi.string().required(),
    commune: Joi.string().required(),
    dateNaissance: Joi.date().max('now').required(),
    typeAgent: Joi.string().valid('collecte', 'commercial').required(),
    maitriseChift: Joi.boolean().optional()
  }),

  // Utilisateur
  createUtilisateur: Joi.object({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    telephone: Joi.string().pattern(/^[0-9]{9,15}$/).required(),
    email: Joi.string().email().optional(),
    cni: Joi.string().optional(),
    adresse: Joi.string().required(),
    region: Joi.string().required(),
    departement: Joi.string().required(),
    commune: Joi.string().required(),
    dateNaissance: Joi.date().max('now').required(),
    profession: Joi.string().optional(),
    typeUtilisateur: Joi.string().valid('communautaire', 'individuel').required(),
    communauteId: Joi.string().optional(),
    agentCollecteId: Joi.string().optional(),
    makerId: Joi.string().optional(),
    mecanismeEndogene: Joi.object({
      type: Joi.string().valid('tontine', 'natt', 'caisse_solidaire', 'autre', 'aucun').required(),
      nom: Joi.string().optional(),
      montantCotisation: Joi.number().min(0).optional(),
      frequenceCotisation: Joi.string().valid('journalier', 'hebdomadaire', 'mensuel').optional()
    }).optional()
  }),

  // Communauté
  createCommunaute: Joi.object({
    nom: Joi.string().required(),
    type: Joi.string().valid('tontine', 'natt', 'caisse_solidaire', 'groupement', 'autre').required(),
    description: Joi.string().optional(),
    region: Joi.string().required(),
    departement: Joi.string().required(),
    commune: Joi.string().required(),
    adresse: Joi.string().optional(),
    makerId: Joi.string().required(),
    estFormalisee: Joi.boolean().optional(),
    numeroEnregistrement: Joi.string().optional(),
    modeleFinancement: Joi.object({
      typeMecanisme: Joi.string().required(),
      montantCotisation: Joi.number().min(0).optional(),
      frequenceCotisation: Joi.string().valid('journalier', 'hebdomadaire', 'mensuel').optional(),
      modePaiement: Joi.array().items(Joi.string()).optional()
    }).required(),
    dateCreation: Joi.date().required()
  }),

  // Souscription
  createSouscription: Joi.object({
    typeSouscription: Joi.string().valid('individuelle', 'communautaire').required(),
    agentCollecteId: Joi.string().optional(),
    makerId: Joi.string().optional(),
    communauteId: Joi.string().optional(),
    questionnaire: Joi.object({
      possedeMecanismeEndogene: Joi.boolean().required(),
      typeMecanisme: Joi.string().optional(),
      faitPartieCommunaute: Joi.boolean().required(),
      souhaiteCreerCommunaute: Joi.boolean().optional(),
      souhaiteEtreAgentCommercial: Joi.boolean().optional(),
      activiteProfessionnelle: Joi.string().optional(),
      revenusEstimes: Joi.string().optional(),
      objectifsFinanciers: Joi.array().items(Joi.string()).optional()
    }).required(),
    packageSouscrit: Joi.object({
      compteChift: Joi.boolean().default(true),
      csu: Joi.boolean().default(true),
      carteNFC: Joi.boolean().default(true),
      accesCredit: Joi.object({
        nano: Joi.boolean().default(true),
        micro: Joi.boolean().default(true)
      }).optional(),
      mobileMoney: Joi.boolean().default(true)
    }).optional()
  }),

  // Authentification
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    telephone: Joi.string().pattern(/^[0-9]{9,15}$/).required(),
    role: Joi.string().valid('admin', 'agent', 'maker', 'mutuelle').required()
  })
};
