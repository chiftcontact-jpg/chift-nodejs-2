import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'AGENT' | 'SUPERVISEUR' | 'MAKER' | 'UTILISATEUR';
  nom: string;
  prenom: string;
  telephone: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  
  // Référence selon le rôle
  referenceId?: mongoose.Types.ObjectId;
  referenceModel?: 'Agent' | 'Maker' | 'Utilisateur';
  
  // Permissions
  permissions: string[];
  
  // Sécurité
  derniereConnexion?: Date;
  tentativesConnexion: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['ADMIN', 'AGENT', 'SUPERVISEUR', 'MAKER', 'UTILISATEUR'],
      required: true
    },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    statut: {
      type: String,
      enum: ['actif', 'inactif', 'suspendu'],
      default: 'actif'
    },
    
    // Référence
    referenceId: {
      type: Schema.Types.ObjectId,
      refPath: 'referenceModel'
    },
    referenceModel: {
      type: String,
      enum: ['Agent', 'Maker', 'Utilisateur']
    },
    
    // Permissions
    permissions: [{ type: String }],
    
    // Sécurité
    derniereConnexion: { type: Date },
    tentativesConnexion: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  {
    timestamps: true
  }
);

// Index
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1, statut: 1 });

export default mongoose.model<IUser>('User', UserSchema);
