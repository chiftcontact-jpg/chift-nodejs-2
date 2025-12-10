import mongoose, { Document, Schema } from 'mongoose';

export interface IAgent extends Document {
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  cni: string;
  adresse: string;
  region: string;
  departement: string;
  commune: string;
  dateNaissance: Date;
  groupeSanguin?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  typeAgent: 'collecte' | 'commercial';
  numeroAgent: string;
  dateEnrolement: Date;
  dateAdhesion?: Date;
  lieuAdhesion?: string;
  maitriseChift: boolean;
  nombreAdhérentsRecrutés: number;
  services?: {
    leket: { actif: boolean; dateActivation?: Date };
    sokhla: { actif: boolean; dateActivation?: Date };
    natt: { actif: boolean; dateActivation?: Date };
    condamne: { actif: boolean; dateActivation?: Date };
    leeb: { actif: boolean; dateActivation?: Date };
  };
  csu?: {
    actif: boolean;
    numeroCSU?: string;
    dateActivation?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true },
    cni: { type: String, required: true, unique: true },
    adresse: { type: String, required: true },
    region: { type: String, required: true },
    departement: { type: String, required: true },
    commune: { type: String, required: true },
    dateNaissance: { type: Date, required: true },
    groupeSanguin: { 
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    statut: {
      type: String,
      enum: ['actif', 'inactif', 'suspendu'],
      default: 'actif'
    },
    typeAgent: {
      type: String,
      enum: ['collecte', 'commercial'],
      required: true
    },
    numeroAgent: {
      type: String,
      unique: true,
      required: true
    },
    dateEnrolement: { type: Date, default: Date.now },
    dateAdhesion: { type: Date },
    lieuAdhesion: { type: String },
    maitriseChift: { type: Boolean, default: false },
    nombreAdhérentsRecrutés: { type: Number, default: 0 },
    services: {
      leket: {
        actif: { type: Boolean, default: false },
        dateActivation: { type: Date }
      },
      sokhla: {
        actif: { type: Boolean, default: false },
        dateActivation: { type: Date }
      },
      natt: {
        actif: { type: Boolean, default: false },
        dateActivation: { type: Date }
      },
      condamne: {
        actif: { type: Boolean, default: false },
        dateActivation: { type: Date }
      },
      leeb: {
        actif: { type: Boolean, default: false },
        dateActivation: { type: Date }
      }
    },
    csu: {
      actif: { type: Boolean, default: false },
      numeroCSU: { type: String },
      dateActivation: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

// Index pour recherche
AgentSchema.index({ nom: 1, prenom: 1 });
AgentSchema.index({ region: 1, commune: 1 });
AgentSchema.index({ numeroAgent: 1 });

export default mongoose.model<IAgent>('Agent', AgentSchema);
