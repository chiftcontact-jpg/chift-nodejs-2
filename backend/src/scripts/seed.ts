import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Agent from '../models/Agent';
import config from '../config';

const seedDatabase = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connecté à MongoDB');

    // 1. Créer l'utilisateur admin
    console.log('\n📝 Création de l\'utilisateur admin...');
    const existingAdmin = await User.findOne({ email: 'admin@chift.com' });
    
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        username: 'admin',
        email: 'admin@chift.com',
        password: hashedAdminPassword,
        role: 'admin',
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
      console.log('✅ Admin créé: admin@chift.com / admin123');
    } else {
      console.log('⚠️  Admin existe déjà');
    }

    // 2. Créer un agent de démonstration
    console.log('\n📝 Création d\'un agent de démonstration...');
    const existingAgent = await Agent.findOne({ email: 'agent@chift.com' });
    
    if (!existingAgent) {
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
      console.log('✅ Agent créé: Moussa Diop (AG-2024-001)');

      // Créer le compte utilisateur pour l'agent
      const hashedAgentPassword = await bcrypt.hash('agent123', 10);
      
      const agentUser = new User({
        username: 'agent.diop',
        email: 'agent@chift.com',
        password: hashedAgentPassword,
        role: 'agent',
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
      console.log('✅ Compte agent créé: agent@chift.com / agent123');
    } else {
      console.log('⚠️  Agent existe déjà');
    }

    console.log('\n================================');
    console.log('🎉 Base de données initialisée !');
    console.log('================================');
    console.log('\n👤 ADMIN:');
    console.log('   📧 Email: admin@chift.com');
    console.log('   🔒 Mot de passe: admin123');
    console.log('   🔑 Role: Administrateur');
    console.log('\n👤 AGENT:');
    console.log('   📧 Email: agent@chift.com');
    console.log('   🔒 Mot de passe: agent123');
    console.log('   🔑 Role: Agent de collecte');
    console.log('\n⚠️  IMPORTANT: Changez les mots de passe en production !');
    console.log('================================\n');

    await mongoose.connection.close();
    console.log('✅ Déconnecté de MongoDB');
    
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

// Exécuter le script
seedDatabase();
