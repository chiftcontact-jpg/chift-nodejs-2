
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rolePrincipal: { type: String, enum: ['ADMIN', 'AGENT', 'SUPERVISEUR', 'MAKER', 'ADHERENT'], default: 'ADMIN' },
  roles: [{
    role: String,
    dateAttribution: { type: Date, default: Date.now },
    actif: { type: Boolean, default: true }
  }],
  nom: String,
  prenom: String,
  telephone: String,
  statut: { type: String, enum: ['actif', 'inactif', 'suspendu'], default: 'actif' },
  permissions: [String]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function importAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chift_users';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const admins = [
      {
        email: 'admin@chift.com',
        username: 'admin_chift',
        nom: 'Chift',
        prenom: 'Admin',
        telephone: '+221770000000'
      },
      {
        email: 'papseynidiakhate@gmail.com',
        username: 'papseyni',
        nom: 'Diakhaté',
        prenom: 'Pape Seyni',
        telephone: '221777777777'
      },
      {
        email: 'admin@chift.sn',
        username: 'admin',
        nom: 'Admin',
        prenom: 'System',
        telephone: '221000000000'
      }
    ];

    for (const adminData of admins) {
      const existingUser = await User.findOne({ email: adminData.email });
      const hashedPassword = await bcrypt.hash('1234', 10);

      if (existingUser) {
        console.log(`Updating existing user: ${adminData.email}`);
        existingUser.password = hashedPassword;
        existingUser.statut = 'actif';
        await existingUser.save();
      } else {
        console.log(`Creating new user: ${adminData.email}`);
        const newUser = new User({
          ...adminData,
          password: hashedPassword,
          rolePrincipal: 'ADMIN',
          roles: [{ role: 'ADMIN', dateAttribution: new Date(), actif: true }],
          statut: 'actif',
          permissions: []
        });
        await newUser.save();
      }
    }

    console.log('Admin users imported/updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error importing admin:', error);
    process.exit(1);
  }
}

importAdmin();
