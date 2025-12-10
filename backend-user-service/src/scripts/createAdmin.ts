import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import connectDB from '../config/database';

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@chift.sn' });
    
    if (existingAdmin) {
      console.log('✅ Admin existe déjà:', existingAdmin.email);
      process.exit(0);
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Créer l'admin
    const admin = new User({
      username: 'admin',
      email: 'admin@chift.sn',
      password: hashedPassword,
      rolePrincipal: 'ADMIN',
      roles: [{ role: 'ADMIN' }],
      nom: 'Admin',
      prenom: 'System',
      telephone: '221777777777',
      statut: 'actif',
      permissions: []
    });

    await admin.save();
    console.log('✅ Admin créé avec succès');
    console.log('Email:', admin.email);
    console.log('Password: Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createAdmin();
