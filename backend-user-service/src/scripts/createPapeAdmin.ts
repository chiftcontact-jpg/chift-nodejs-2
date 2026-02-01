import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import connectDB from '../config/database';

const createPapeAdmin = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    // Supprimer l'ancien admin si existant pour éviter les conflits
    await User.deleteOne({ email: 'papseynidiakhate@gmail.com' });
    await User.deleteOne({ email: 'admin@chift.sn' });
    
    // Hash du mot de passe '1234'
    const hashedPassword1234 = await bcrypt.hash('1234', 10);
    const hashedPasswordAdmin = await bcrypt.hash('Admin123!', 10);

    // Créer l'admin Pape Seyni Diakhaté
    const papeAdmin = new User({
      username: 'papseyni',
      email: 'papseynidiakhate@gmail.com',
      password: hashedPassword1234,
      rolePrincipal: 'ADMIN',
      roles: [{ role: 'ADMIN' }],
      nom: 'Diakhaté',
      prenom: 'Pape Seyni',
      telephone: '221777777777',
      adresse: 'Dakar Plateau',
      region: 'Dakar',
      departement: 'Dakar',
      commune: 'Dakar Plateau',
      dateNaissance: new Date('1990-01-01'),
      statut: 'actif',
      permissions: []
    });

    // Créer aussi l'admin standard au cas où
    const standardAdmin = new User({
      username: 'admin',
      email: 'admin@chift.sn',
      password: hashedPasswordAdmin,
      rolePrincipal: 'ADMIN',
      roles: [{ role: 'ADMIN', dateAttribution: new Date(), actif: true }],
      nom: 'Admin',
      prenom: 'System',
      telephone: '221777777777',
      adresse: 'Dakar Plateau',
      region: 'Dakar',
      departement: 'Dakar',
      commune: 'Dakar Plateau',
      dateNaissance: new Date('1990-01-01'),
      statut: 'actif',
      permissions: []
    });

    await papeAdmin.save();
    await standardAdmin.save();

    console.log('✅ Admins créés avec succès');
    console.log('--- Admin Image ---');
    console.log('Email:', papeAdmin.email);
    console.log('Password: 1234');
    console.log('--- Admin Standard ---');
    console.log('Email:', standardAdmin.email);
    console.log('Password: Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createPapeAdmin();
