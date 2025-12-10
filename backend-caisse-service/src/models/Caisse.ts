import mongoose, { Document, Schema } from 'mongoose';

export interface ICaisse extends Document {
  nom: string;
  code: string;
  type: 'LEKKET' | 'CLASSIQUE';
  statut: 'active' | 'inactive' | 'suspendue';
  badge?: 'Avec' | 'Sans' | 'Djambal' | 'Madial';
  
  // Localisation
  region: string;
  departement: string;
  arrondissement?: string;
  commune: string;
  adresse?: string;
  
  // Informations financières
  solde: number;
  montantMinimumCotisation: number;
  montantMaximumCotisation?: number;
  tauxInteret?: number;
  solidarite?: number;
  
  // Membres
  nombreMembres: number;
  femmesActives?: number;
  hommesActifs?: number;
  capaciteMaximale?: number;
  
  // Fréquence et échéance
  frequence?: string;
  jour?: string;
  echeanceEvenement?: string;
  dateEcheance?: Date;
  
  // Responsable
  responsableId?: string;
  responsableNom?: string;
  responsableContact?: string;
  
  // Dates
  dateCreation: Date;
  dateCreationPhysique?: Date;
  dateDerniereActivite?: Date;
  
  // Metadata
  description?: string;
  reseauId?: string;
  communauteId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const CaisseSchema = new Schema<ICaisse>(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['LEKKET', 'CLASSIQUE'],
      required: true,
      default: 'CLASSIQUE'
    },
    statut: {
      type: String,
      enum: ['active', 'inactive', 'suspendue'],
      default: 'active'
    },
    badge: {
      type: String,
      enum: ['Avec', 'Sans', 'Djambal', 'Madial']
    },
    region: {
      type: String,
      required: true
    },
    departement: {
      type: String,
      required: true
    },
    arrondissement: {
      type: String
    },
    commune: {
      type: String,
      required: true
    },
    adresse: {
      type: String
    },
    solde: {
      type: Number,
      default: 0,
      min: 0
    },
    montantMinimumCotisation: {
      type: Number,
      required: true,
      min: 0
    },
    montantMaximumCotisation: {
      type: Number,
      min: 0
    },
    tauxInteret: {
      type: Number,
      min: 0,
      max: 100
    },
    solidarite: {
      type: Number,
      min: 0
    },
    nombreMembres: {
      type: Number,
      default: 0,
      min: 0
    },
    femmesActives: {
      type: Number,
      min: 0
    },
    hommesActifs: {
      type: Number,
      min: 0
    },
    capaciteMaximale: {
      type: Number,
      min: 0
    },
    frequence: {
      type: String
    },
    jour: {
      type: String
    },
    echeanceEvenement: {
      type: String
    },
    dateEcheance: {
      type: Date
    },
    responsableId: {
      type: String
    },
    responsableNom: {
      type: String
    },
    responsableContact: {
      type: String
    },
    dateCreation: {
      type: Date,
      default: Date.now
    },
    dateCreationPhysique: {
      type: Date
    },
    dateDerniereActivite: {
      type: Date
    },
    description: {
      type: String
    },
    reseauId: {
      type: String
    },
    communauteId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Middleware pour calculer automatiquement le nombre de membres
CaisseSchema.pre('save', function(next) {
  if (this.femmesActives !== undefined || this.hommesActifs !== undefined) {
    this.nombreMembres = (this.femmesActives || 0) + (this.hommesActifs || 0);
  }
  next();
});

// Index pour les recherches
// Note: 'code' a déjà un index unique automatique, pas besoin de le redéfinir
CaisseSchema.index({ region: 1, departement: 1, commune: 1 });
CaisseSchema.index({ statut: 1 });
CaisseSchema.index({ type: 1 });
CaisseSchema.index({ reseauId: 1 });

const Caisse = mongoose.model<ICaisse>('Caisse', CaisseSchema);

export default Caisse;
