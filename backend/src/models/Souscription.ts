import mongoose, { Document, Schema } from 'mongoose';

export interface ISouscription extends Document {
  numeroSouscription: string;
  
  // Relations
  adherentId?: mongoose.Types.ObjectId;
  agentCollecteId?: mongoose.Types.ObjectId;
  makerId?: mongoose.Types.ObjectId;
  communauteId?: mongoose.Types.ObjectId;
  
  // Type de souscription
  typeSouscription: 'individuelle' | 'communautaire';
  
  // Questionnaire d'enrôlement
  questionnaire: {
    possedeMecanismeEndogene: boolean;
    typeMecanisme?: string;
    faitPartieCommunaute: boolean;
    souhaiteCreerCommunaute?: boolean;
    souhaiteEtreAgentCommercial?: boolean;
    activiteProfessionnelle?: string;
    revenusEstimes?: string;
    objectifsFinanciers?: string[];
  };
  
  // Package souscrit
  packageSouscrit: {
    compteChift: boolean;
    csu: boolean;
    carteNFC: boolean;
    accesCredit: {
      nano: boolean;
      micro: boolean;
    };
    mobileMoney: boolean;
  };
  
  // Statut du processus
  statut: 'en_cours' | 'completée' | 'annulée' | 'en_attente';
  etapeActuelle: 'collecte' | 'enrolement' | 'validation' | 'activation' | 'terminée';
  
  // Documents
  documents?: Array<{
    type: string;
    url: string;
    dateAjout: Date;
  }>;
  
  // Suivi
  dateCollecte: Date;
  dateEnrolement?: Date;
  dateValidation?: Date;
  dateActivation?: Date;
  
  // Mutuelle assignée
  mutuelleAssignee?: string;
  carteNFCRemise: boolean;
  dateRemiseCarteNFC?: Date;
  
  // Notes et commentaires
  notes?: string;
  historique: Array<{
    action: string;
    utilisateur: string;
    date: Date;
    details?: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const SouscriptionSchema = new Schema<ISouscription>(
  {
    numeroSouscription: {
      type: String,
      unique: true,
      required: true
    },
    
    // Relations
    adherentId: {
      type: Schema.Types.ObjectId,
      ref: 'Adhérent'
    },
    agentCollecteId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent'
    },
    makerId: {
      type: Schema.Types.ObjectId,
      ref: 'Maker'
    },
    communauteId: {
      type: Schema.Types.ObjectId,
      ref: 'Communaute'
    },
    
    typeSouscription: {
      type: String,
      enum: ['individuelle', 'communautaire'],
      required: true
    },
    
    // Questionnaire
    questionnaire: {
      possedeMecanismeEndogene: { type: Boolean, required: true },
      typeMecanisme: { type: String },
      faitPartieCommunaute: { type: Boolean, required: true },
      souhaiteCreerCommunaute: { type: Boolean },
      souhaiteEtreAgentCommercial: { type: Boolean },
      activiteProfessionnelle: { type: String },
      revenusEstimes: { type: String },
      objectifsFinanciers: [{ type: String }]
    },
    
    // Package
    packageSouscrit: {
      compteChift: { type: Boolean, default: true },
      csu: { type: Boolean, default: true },
      carteNFC: { type: Boolean, default: true },
      accesCredit: {
        nano: { type: Boolean, default: true },
        micro: { type: Boolean, default: true }
      },
      mobileMoney: { type: Boolean, default: true }
    },
    
    // Statut
    statut: {
      type: String,
      enum: ['en_cours', 'completée', 'annulée', 'en_attente'],
      default: 'en_cours'
    },
    etapeActuelle: {
      type: String,
      enum: ['collecte', 'enrolement', 'validation', 'activation', 'terminée'],
      default: 'collecte'
    },
    
    // Documents
    documents: [{
      type: { type: String, required: true },
      url: { type: String, required: true },
      dateAjout: { type: Date, default: Date.now }
    }],
    
    // Dates
    dateCollecte: { type: Date, default: Date.now },
    dateEnrolement: { type: Date },
    dateValidation: { type: Date },
    dateActivation: { type: Date },
    
    // Mutuelle
    mutuelleAssignee: { type: String },
    carteNFCRemise: { type: Boolean, default: false },
    dateRemiseCarteNFC: { type: Date },
    
    // Suivi
    notes: { type: String },
    historique: [{
      action: { type: String, required: true },
      utilisateur: { type: String, required: true },
      date: { type: Date, default: Date.now },
      details: { type: String }
    }]
  },
  {
    timestamps: true
  }
);

// Index
SouscriptionSchema.index({ numeroSouscription: 1 });
SouscriptionSchema.index({ adherentId: 1 });
SouscriptionSchema.index({ agentCollecteId: 1 });
SouscriptionSchema.index({ statut: 1, etapeActuelle: 1 });
SouscriptionSchema.index({ dateCollecte: -1 });

export default mongoose.model<ISouscription>('Souscription', SouscriptionSchema);
