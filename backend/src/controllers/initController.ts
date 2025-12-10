import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Agent from '../models/Agent';

/**
 * Initialise la base de données avec les utilisateurs par défaut
 * Cette route est à utiliser UNIQUEMENT lors de la première installation
 */
export const initializeDatabase = async (req: Request, res: Response) => {
  try {
    // Vérifier si des utilisateurs existent déjà
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'La base de données a déjà été initialisée',
        usersCount: userCount
      });
    }

    // 1. Créer l'utilisateur admin
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@chift.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
      nom: 'Administrateur',
      prenom: 'CHIFT',
      telephone: '+221 77 000 00 00',
      statut: 'actif',
      permissions: [
        'gestion_utilisateurs',
        'gestion_agents',
        'gestion_caisses',
        'gestion_reseaux',
        'gestion_communautes',
        'gestion_adherents',
        'gestion_souscriptions',
        'gestion_comptes',
        'gestion_services',
        'consultation_rapports',
        'configuration_systeme',
        'tous_droits'
      ],
      tentativesConnexion: 0
    });

    await adminUser.save();

    // 2. Créer un agent de démonstration
    const demoAgent = new Agent({
      nom: 'Diop',
      prenom: 'Moussa',
      telephone: '+221 77 123 45 67',
      email: 'agent@chift.com',
      cni: '1234567890123',
      adresse: 'Dakar, Plateau',
      region: 'Dakar',
      departement: 'Dakar',
      commune: 'Plateau',
      dateNaissance: new Date('1990-01-15'),
      groupeSanguin: 'O+',
      statut: 'actif',
      typeAgent: 'collecte',
      numeroAgent: 'AG-2024-001',
      dateEnrolement: new Date(),
      maitriseChift: true,
      nombreAdhérentsRecrutés: 0,
      services: {
        leket: { actif: true, dateActivation: new Date() },
        sokhla: { actif: true, dateActivation: new Date() },
        natt: { actif: true, dateActivation: new Date() },
        condamne: { actif: false },
        leeb: { actif: false }
      },
      csu: {
        actif: false
      }
    });

    await demoAgent.save();

    // Créer le compte utilisateur pour l'agent
    const hashedAgentPassword = await bcrypt.hash('agent123', 10);
    
    const agentUser = new User({
      username: 'agent.diop',
      email: 'agent@chift.com',
      password: hashedAgentPassword,
      role: 'AGENT',
      nom: 'Diop',
      prenom: 'Moussa',
      telephone: '+221 77 123 45 67',
      statut: 'actif',
      referenceId: demoAgent._id,
      referenceModel: 'Agent',
      permissions: [
        'gestion_adherents',
        'gestion_souscriptions',
        'consultation_caisses',
        'gestion_sokhla'
      ],
      tentativesConnexion: 0
    });

    await agentUser.save();

    res.status(201).json({
      success: true,
      message: 'Base de données initialisée avec succès',
      users: {
        admin: {
          email: 'admin@chift.com',
          password: 'admin123',
          role: 'ADMIN',
          nom: 'Administrateur CHIFT'
        },
        agent: {
          email: 'agent@chift.com',
          password: 'agent123',
          role: 'AGENT',
          nom: 'Moussa Diop',
          numeroAgent: 'AG-2024-001'
        }
      },
      warning: 'IMPORTANT: Changez les mots de passe en production !'
    });

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'initialisation de la base de données',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};
