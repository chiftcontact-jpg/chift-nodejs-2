import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Compte from './models/Compte';
import Service from './models/Service';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/chift_comptes';
const USER_ID = '697a29ef542b5afdb2799b80'; // chiftcontact@gmail.com

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB pour le seeding');

    // Nettoyage
    await Compte.deleteMany({ userId: USER_ID });
    await Service.deleteMany({ userId: USER_ID });

    // Création des comptes
    const comptes = await Compte.insertMany([
      { nom: 'LEKET', statut: 'actif', userId: USER_ID, description: 'Compte Leket' },
      { nom: 'CONDAMNÉ', statut: 'actif', userId: USER_ID, description: 'Compte Condamné' },
      { nom: 'NATT', statut: 'actif', userId: USER_ID, description: 'Compte Natt' }
    ]);

    console.log(`${comptes.length} comptes créés`);

    // Création des services
    const services = await Service.insertMany([
      { 
        nom: 'SOKHLA', 
        statut: 'actif', 
        userId: USER_ID, 
        description: 'Service Sokhla',
        comptesAssocies: [comptes[0]._id, comptes[1]._id]
      },
      { 
        nom: 'LEBB', 
        statut: 'actif', 
        userId: USER_ID, 
        description: 'Service Lebb',
        comptesAssocies: [comptes[2]._id]
      }
    ]);

    console.log(`${services.length} services créés`);

    console.log('Seeding terminé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur pendant le seeding:', error);
    process.exit(1);
  }
}

seed();
