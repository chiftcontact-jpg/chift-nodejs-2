import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const MONGO_URI = "mongodb://mongo:dBUixODgNpxrRShfCEXUVDOSSePDzatj@mainline.proxy.rlwy.net:43933";

async function checkUsers() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connecté !');

    const users = await User.find({}, 'email username rolePrincipal');
    console.log('Utilisateurs trouvés :', users.length);
    users.forEach((u: any) => {
      console.log(`- ${u.email} (${u.username}) : ${u.rolePrincipal}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Erreur :', error);
  }
}

checkUsers();
