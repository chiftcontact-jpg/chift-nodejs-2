import mongoose, { Document, Schema } from 'mongoose';

// Adhésion à une caisse : un utilisateur peut être membre de plusieurs caisses
export interface IAdhesionCaisse {
  caisseId: mongoose.Types.ObjectId;
  makerId?: mongoose.Types.ObjectId; // Maker qui a enrôlé l'utilisateur dans cette caisse
  dateAdhesion: Date;
  statutAdhesion: 'actif' | 'inactif' | 'suspendu';
  // Informations spécifiques à cette caisse
  numeroCaisse?: string; // Numéro d'utilisateur dans cette caisse spécifique
}

export interface IUtilisateur extends Document {
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  cni?: string;
  adresse: string;
  region: string;
  departement: string;
  commune: string;
  dateNaissance: Date;
  profession?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  numeroUtilisateur: string; // Numéro unique global CHIFT
  typeUtilisateur: 'communautaire' | 'individuel';
  
  // Multi-caisses : un utilisateur peut être dans plusieurs caisses
  caisses: IAdhesionCaisse[];
  
  // Relations historiques (conservées pour compatibilité)
  communauteId?: mongoose.Types.ObjectId;
  agentCollecteId?: mongoose.Types.ObjectId; // Premier agent qui a enrôlé l'utilisateur
  makerId?: mongoose.Types.ObjectId; // Premier maker (si enrôlé par un maker)
  
  // Package CHIFT
  compteChift: {
    numeroCompte: string;
    solde: number;
    dateOuverture: Date;
    statut: 'actif' | 'inactif' | 'bloqué';
  };
  
  carteNFC?: {
    numeroSerie: string;
    dateEmission: Date;
    dateRecuperation?: Date;
    mutuelleRecuperation?: string;
    statut: 'active' | 'perdue' | 'bloquée';
  };
  
  // CSU (Couverture Santé Universelle)
  csu: {
    numeroCSU: string;
    dateActivation: Date;
    statut: 'actif' | 'inactif' | 'suspendu';
  };
  
  // Mécanisme endogène
  mecanismeEndogene?: {
    type: 'tontine' | 'natt' | 'caisse_solidaire' | 'autre' | 'aucun';
    nom?: string;
    montantCotisation?: number;
    frequenceCotisation?: 'journalier' | 'hebdomadaire' | 'mensuel';
  };
  
  // Accès aux services
  accesCredit: {
    nano: boolean;
    micro: boolean;
    historiqueDemandes: number;
  };
  
  accesMobileMoney: boolean;
  mutuelleProche?: string;
  
  dateEnrolement: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdhesionCaisseSchema = new Schema<IAdhesionCaisse>({
  caisseId: {
    type: Schema.Types.ObjectId,
    ref: 'Caisse',
    required: true
  },
  makerId: {
    type: Schema.Types.ObjectId,
    ref: 'Maker'
  },
  dateAdhesion: { type: Date, default: Date.now },
  statutAdhesion: {
    type: String,
    enum: ['actif', 'inactif', 'suspendu'],
    default: 'actif'
  },
  numeroCaisse: { type: String }
}, { _id: false });

const UtilisateurSchema = new Schema<IUtilisateur>(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true },
    cni: { type: String, unique: true, sparse: true },
    adresse: { type: String, required: true },
    region: { type: String, required: true },
    departement: { type: String, required: true },
    commune: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    profession: { type: String },
    statut: {
      type: String,
      enum: ['actif', 'inactif', 'suspendu'],
      default: 'actif'
    },
    numeroUtilisateur: {
      type: String,
      unique: true,
      required: true
    },
    typeUtilisateur: {
      type: String,
      enum: ['communautaire', 'individuel'],
      required: true
    },
    
    // Multi-caisses
    caisses: {
      type: [AdhesionCaisseSchema],
      default: []
    },
    
    // Relations historiques
    communauteId: {
      type: Schema.Types.ObjectId,
      ref: 'Communaute'
    },
    agentCollecteId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent'
    },
    makerId: {
      type: Schema.Types.ObjectId,
      ref: 'Maker'
    },
    
    // Package CHIFT
    compteChift: {
      numeroCompte: { type: String, required: true, unique: true },
      solde: { type: Number, default: 0 },
      dateOuverture: { type: Date, default: Date.now },
      statut: {
        type: String,
        enum: ['actif', 'inactif', 'bloqué'],
        default: 'actif'
      }
    },
    
    carteNFC: {
      numeroSerie: { type: String, unique: true, sparse: true },
      dateEmission: { type: Date },
      dateRecuperation: { type: Date },
      mutuelleRecuperation: { type: String },
      statut: {
        type: String,
        enum: ['active', 'perdue', 'bloquée'],
        default: 'active'
      }
    },
    
    csu: {
      numeroCSU: { type: String, required: true, unique: true },
      dateActivation: { type: Date, default: Date.now },
      statut: {
        type: String,
        enum: ['actif', 'inactif', 'suspendu'],
        default: 'actif'
      }
    },
    
    mecanismeEndogene: {
      type: {
        type: String,
        enum: ['tontine', 'natt', 'caisse_solidaire', 'autre', 'aucun']
      },
      nom: { type: String },
      montantCotisation: { type: Number },
      frequenceCotisation: {
        type: String,
        enum: ['journalier', 'hebdomadaire', 'mensuel']
      }
    },
    
    accesCredit: {
      nano: { type: Boolean, default: true },
      micro: { type: Boolean, default: true },
      historiqueDemandes: { type: Number, default: 0 }
    },
    
    accesMobileMoney: { type: Boolean, default: true },
    mutuelleProche: { type: String },
    dateEnrolement: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

// Index
UtilisateurSchema.index({ nom: 1, prenom: 1 });
UtilisateurSchema.index({ numeroUtilisateur: 1 });
UtilisateurSchema.index({ 'compteChift.numeroCompte': 1 });
UtilisateurSchema.index({ 'csu.numeroCSU': 1 });
UtilisateurSchema.index({ communauteId: 1 });
UtilisateurSchema.index({ region: 1, commune: 1 });
UtilisateurSchema.index({ 'caisses.caisseId': 1, 'caisses.statutAdhesion': 1 });
UtilisateurSchema.index({ 'caisses.makerId': 1 });

export default mongoose.model<IUtilisateur>('Utilisateur', UtilisateurSchema);