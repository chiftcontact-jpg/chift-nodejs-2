import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import connectDB from '../config/database';

const resetAdminPassword = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    // Trouver l'admin
    const admin = await User.findOne({ email: 'admin@chift.sn' });
    
    if (!admin) {
      console.log('❌ Admin non trouvé');
      process.exit(1);
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Mettre à jour le mot de passe et réinitialiser le statut
    admin.password = hashedPassword;
    admin.statut = 'actif';
    admin.tentativesConnexion = 0;
    
    await admin.save();
    
    console.log('✅ Mot de passe admin réinitialisé avec succès');
    console.log('Email: admin@chift.sn');
    console.log('Mot de passe: Admin123!');
    console.log('Statut:', admin.statut);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

resetAdminPassword();
