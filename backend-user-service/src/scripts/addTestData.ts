import connectDB from '../config/database';
import User from '../models/User';
import logger from '../utils/logger';

async function addTestData() {
  try {
    await connectDB();
    
    // Mettre à jour l'utilisateur admin avec profession et bénéficiaires
    const admin = await User.findOne({ email: 'admin@chift.sn' });
    
    if (admin) {
      admin.profession = 'Administrateur Système';
      admin.beneficiaires = [
        {
          nom: 'Diop',
          prenom: 'Fatou',
          relation: 'Épouse',
          telephone: '+221771234567'
        },
        {
          nom: 'Diop',
          prenom: 'Moussa',
          relation: 'Fils',
          telephone: '+221779876543'
        }
      ];
      
      await admin.save();
      logger.info('✅ Données de test ajoutées pour admin@chift.sn');
      console.log('✅ Profession et bénéficiaires ajoutés avec succès');
    } else {
      console.log('❌ Utilisateur admin non trouvé');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

addTestData();
