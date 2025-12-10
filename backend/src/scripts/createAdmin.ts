import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import config from '../config';

const createAdminUser = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@chift.com' });
    
    if (existingAdmin) {
      console.log('⚠️  L\'utilisateur admin existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.nom, existingAdmin.prenom);
      console.log('🔑 Role:', existingAdmin.role);
      await mongoose.connection.close();
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer l'utilisateur admin
    const adminUser = new User({
      username: 'admin',
      email: 'admin@chift.com',
      password: hashedPassword,
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

    console.log('');
    console.log('🎉 Utilisateur admin créé avec succès !');
    console.log('================================');
    console.log('📧 Email: admin@chift.com');
    console.log('🔒 Mot de passe: admin123');
    console.log('👤 Nom: Administrateur CHIFT');
    console.log('📱 Téléphone: +221 77 000 00 00');
    console.log('🔑 Role: admin');
    console.log('✅ Statut: actif');
    console.log('🛡️  Permissions: Tous les droits');
    console.log('================================');
    console.log('');
    console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion !');

    await mongoose.connection.close();
    console.log('✅ Déconnecté de MongoDB');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
};

// Exécuter le script
createAdminUser();
