import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunaute extends Document {
  nom: string;
  type: 'tontine' | 'natt' | 'caisse_solidaire' | 'groupement' | 'autre';
  description?: string;
  
  // Localisation
  region: string;
  departement: string;
  commune: string;
  adresse?: string;
  
  // Statut
  statut: 'actif' | 'inactif' | 'suspendu';
  estFormalisee: boolean;
  numeroEnregistrement?: string;
  
  // Governance
  makerId: mongoose.Types.ObjectId; // Président/responsable
  bureauExecutif?: Array<{
    role: string;
    adherentId: mongoose.Types.ObjectId;
    dateDebut: Date;
    dateFin?: Date;
  }>;
  
  // Membres
  nombreMembres: number;
  membresActifs: number;
  
  // Mécanisme de financement
  modeleFinancement: {
    typeMecanisme: string;
    montantCotisation?: number;
    frequenceCotisation?: 'journalier' | 'hebdomadaire' | 'mensuel';
    modePaiement: string[];
    reglesCotisation?: string;
  };
  
  // Fonds communautaire
  fondsCommunautaire: {
    soldeTotal: number;
    soldeCaisse: number;
    soldeEpargne: number;
    derniereMiseAJour: Date;
  };
  
  // Package CHIFT
  packageChift: {
    dateAdhesion: Date;
    ameliorationsApportees?: string[];
    formationsRecues?: Array<{
      theme: string;
      date: Date;
      formateur?: string;
    }>;
  };
  
  // Projets et investissements
  projets?: Array<{
    nom: string;
    description?: string;
    montant?: number;
    statut: 'en_cours' | 'terminé' | 'suspendu';
    dateDebut: Date;
    dateFin?: Date;
  }>;
  
  // Accès aux services
  mutuellePartenaire?: string;
  accesFormation: boolean;
  accesConseil: boolean;
  rechercheFinancement: boolean;
  
  dateCreation: Date;
  dateEnrolement: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommunauteSchema = new Schema<ICommunaute>(
  {
    nom: { type: String, required: true },
    type: {
      type: String,
      enum: ['tontine', 'natt', 'caisse_solidaire', 'groupement', 'autre'],
      required: true
    },
    description: { type: String },
    
    // Localisation
    region: { type: String, required: true },
    departement: { type: String, required: true },
    commune: { type: String, required: true },
    adresse: { type: String },
    
    // Statut
    statut: {
      type: String,
      enum: ['actif', 'inactif', 'suspendu'],
      default: 'actif'
    },
    estFormalisee: { type: Boolean, default: false },
    numeroEnregistrement: { type: String, unique: true, sparse: true },
    
    // Governance
    makerId: {
      type: Schema.Types.ObjectId,
      ref: 'Maker',
      required: true
    },
    bureauExecutif: [{
      role: { type: String, required: true },
      adherentId: {
        type: Schema.Types.ObjectId,
        ref: 'Adhérent',
        required: true
      },
      dateDebut: { type: Date, required: true },
      dateFin: { type: Date }
    }],
    
    // Membres
    nombreMembres: { type: Number, default: 0 },
    membresActifs: { type: Number, default: 0 },
    
    // Mécanisme de financement
    modeleFinancement: {
      typeMecanisme: { type: String, required: true },
      montantCotisation: { type: Number },
      frequenceCotisation: {
        type: String,
        enum: ['journalier', 'hebdomadaire', 'mensuel']
      },
      modePaiement: [{ type: String }],
      reglesCotisation: { type: String }
    },
    
    // Fonds communautaire
    fondsCommunautaire: {
      soldeTotal: { type: Number, default: 0 },
      soldeCaisse: { type: Number, default: 0 },
      soldeEpargne: { type: Number, default: 0 },
      derniereMiseAJour: { type: Date, default: Date.now }
    },
    
    // Package CHIFT
    packageChift: {
      dateAdhesion: { type: Date, default: Date.now },
      ameliorationsApportees: [{ type: String }],
      formationsRecues: [{
        theme: { type: String, required: true },
        date: { type: Date, required: true },
        formateur: { type: String }
      }]
    },
    
    // Projets
    projets: [{
      nom: { type: String, required: true },
      description: { type: String },
      montant: { type: Number },
      statut: {
        type: String,
        enum: ['en_cours', 'terminé', 'suspendu'],
        default: 'en_cours'
      },
      dateDebut: { type: Date, required: true },
      dateFin: { type: Date }
    }],
    
    // Services
    mutuellePartenaire: { type: String },
    accesFormation: { type: Boolean, default: false },
    accesConseil: { type: Boolean, default: false },
    rechercheFinancement: { type: Boolean, default: false },
    
    dateCreation: { type: Date, required: true },
    dateEnrolement: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

// Index
CommunauteSchema.index({ nom: 1 });
CommunauteSchema.index({ region: 1, commune: 1 });
CommunauteSchema.index({ makerId: 1 });
CommunauteSchema.index({ statut: 1 });

export default mongoose.model<ICommunaute>('Communaute', CommunauteSchema);
