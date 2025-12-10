import mongoose, { Document, Schema } from 'mongoose';

export interface IMaker extends Document {
  nom: string;
  prenom: string;
  telephone: string;
  whatsapp: string; // Numéro WhatsApp (requis pour l'enrôlement)
  email?: string;
  cni: string; // Pièce d'identité (requis pour l'enrôlement)
  adresse: string;
  region: string;
  departement: string;
  commune: string;
  dateNaissance: Date;
  statut: 'actif' | 'inactif' | 'suspendu';
  numeroMaker: string;
  
  // Un Maker est lié à UNE SEULE caisse
  caisseId: mongoose.Types.ObjectId;
  
  // Agent de collecte qui a enrôlé ce Maker
  agentEnroleurId: mongoose.Types.ObjectId;
  
  communauteId?: mongoose.Types.ObjectId;
  estPresidentGroupement: boolean;
  dateEnrolement: Date;
  maitriseChift: boolean;
  nombreAdhérentsOrientés: number; // Nombre d'adhérents enrôlés par ce Maker
  mutuelleProche?: string;
  
  // Lien d'accès envoyé après enrôlement
  lienAcces?: string;
  dateLienEnvoye?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const MakerSchema = new Schema<IMaker>(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    whatsapp: { type: String, required: true, index: true },
    email: { type: String, lowercase: true },
    cni: { type: String, required: true, unique: true },
    adresse: { type: String, required: true },
    region: { type: String, required: true },
    departement: { type: String, required: true },
    commune: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    statut: {
      type: String,
      enum: ['actif', 'inactif', 'suspendu'],
      default: 'actif'
    },
    numeroMaker: {
      type: String,
      unique: true,
      required: true
    },
    caisseId: {
      type: Schema.Types.ObjectId,
      ref: 'Caisse',
      required: true,
      index: true
    },
    agentEnroleurId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
      index: true
    },
    communauteId: {
      type: Schema.Types.ObjectId,
      ref: 'Communaute'
    },
    estPresidentGroupement: { type: Boolean, default: false },
    dateEnrolement: { type: Date, default: Date.now },
    maitriseChift: { type: Boolean, default: false },
    nombreAdhérentsOrientés: { type: Number, default: 0 },
    mutuelleProche: { type: String },
    lienAcces: { type: String },
    dateLienEnvoye: { type: Date }
  },
  {
    timestamps: true
  }
);

// Index
MakerSchema.index({ nom: 1, prenom: 1 });
MakerSchema.index({ region: 1, commune: 1 });
MakerSchema.index({ numeroMaker: 1 });
MakerSchema.index({ communauteId: 1 });
MakerSchema.index({ caisseId: 1, statut: 1 });
MakerSchema.index({ agentEnroleurId: 1 });
MakerSchema.index({ whatsapp: 1 });

export default mongoose.model<IMaker>('Maker', MakerSchema);
