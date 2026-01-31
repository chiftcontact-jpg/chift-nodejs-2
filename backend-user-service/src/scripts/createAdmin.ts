import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import connectDB from '../config/database';

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    // Liste des utilisateurs à créer
    const usersToCreate = [
      {
        username: 'admin_sn',
        email: 'admin@chift.sn',
        password: 'Admin123!',
        rolePrincipal: 'ADMIN',
        nom: 'Admin',
        prenom: 'System SN',
        telephone: '221777777777',
        adresse: 'Dakar',
        region: 'DAKAR',
        departement: 'DAKAR',
        commune: 'DAKAR',
        dateNaissance: new Date('1980-01-01'),
        statut: 'actif'
      },
      {
        username: 'admin',
        email: 'admin@chift.com',
        password: 'admin123',
        rolePrincipal: 'ADMIN',
        nom: 'Admin',
        prenom: 'System COM',
        telephone: '221777777778',
        adresse: 'Dakar',
        region: 'DAKAR',
        departement: 'DAKAR',
        commune: 'DAKAR',
        dateNaissance: new Date('1980-01-01'),
        statut: 'actif'
      },
      {
        username: 'agent',
        email: 'agent@chift.com',
        password: 'agent123',
        rolePrincipal: 'AGENT',
        nom: 'Agent',
        prenom: 'Demo',
        telephone: '221770000000',
        adresse: 'Dakar',
        region: 'DAKAR',
        departement: 'DAKAR',
        commune: 'DAKAR',
        dateNaissance: new Date('1990-01-01'),
        statut: 'actif'
      },
      {
        username: 'papseynidiakhate',
        email: 'papseynidiakhate@gmail.com',
        password: '1234',
        rolePrincipal: 'ADMIN',
        nom: 'Diakhate',
        prenom: 'Pape Seyni',
        telephone: '221770000001',
        adresse: 'Dakar',
        region: 'DAKAR',
        departement: 'DAKAR',
        commune: 'DAKAR',
        dateNaissance: new Date('1985-01-01'),
        statut: 'actif'
      }
    ];

    for (const userData of usersToCreate) {
      const existingUser = await User.findOne({ email: userData.email });
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      if (!existingUser) {
        const user = new User({
          ...userData,
          password: hashedPassword,
          roles: [{ 
            role: userData.rolePrincipal as any,
            dateAttribution: new Date(),
            actif: true
          }],
          permissions: []
        });
        await user.save();
        console.log(`✅ Utilisateur ${userData.email} créé avec succès`);
      } else {
        // Supprimer l'existant pour être sûr de repartir sur une base saine avec tous les champs
        await User.deleteOne({ _id: existingUser._id });
        
        const user = new User({
          ...userData,
          password: hashedPassword,
          roles: [{ 
            role: userData.rolePrincipal as any,
            dateAttribution: new Date(),
            actif: true
          }],
          permissions: []
        });
        await user.save();
        console.log(`✅ Utilisateur ${userData.email} réinitialisé avec succès`);
      }
    }
    
    console.log('🚀 Script de création/mise à jour terminé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createAdmin();
