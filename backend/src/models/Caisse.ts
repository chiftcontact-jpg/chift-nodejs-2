import mongoose, { Document, Schema } from 'mongoose';

export interface ICaisse extends Document {
  nom: string;
  numero: string;
  communaute: mongoose.Types.ObjectId;
  region: string;
  departement: string;
  commune: string;
  statut: 'active' | 'inactive' | 'suspendue';
  badge: 'Djambal' | 'Madial' | 'Avec';
  frequence: 'quotidien' | 'hebdomadaire' | 'mensuel';
  jour: string;
  totalMembres: number;
  femmes: number;
  hommes: number;
  montantCotisation: number;
  makers: Array<{
    agent: mongoose.Types.ObjectId;
    nom: string;
    dateAssignation: Date;
  }>;
  dateCreation: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CaisseSchema = new Schema<ICaisse>(
  {
    nom: { type: String, required: true },
    numero: { type: String, required: true, unique: true },
    communaute: {
      type: Schema.Types.ObjectId,
      ref: 'Communaute',
      required: true
    },
    region: { type: String, required: true },
    departement: { type: String, required: true },
    commune: { type: String, required: true },
    statut: {
      type: String,
      enum: ['active', 'inactive', 'suspendue'],
      default: 'active'
    },
    badge: {
      type: String,
      enum: ['Djambal', 'Madial', 'Avec'],
      required: true
    },
    frequence: {
      type: String,
      enum: ['quotidien', 'hebdomadaire', 'mensuel'],
      required: true
    },
    jour: { type: String, required: true },
    totalMembres: { type: Number, default: 0 },
    femmes: { type: Number, default: 0 },
    hommes: { type: Number, default: 0 },
    montantCotisation: { type: Number, required: true },
    makers: [{
      agent: {
        type: Schema.Types.ObjectId,
        ref: 'Agent'
      },
      nom: String,
      dateAssignation: {
        type: Date,
        default: Date.now
      }
    }],
    dateCreation: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

// Index pour recherche
CaisseSchema.index({ nom: 1 });
CaisseSchema.index({ numero: 1 });
CaisseSchema.index({ communaute: 1 });
CaisseSchema.index({ region: 1, commune: 1 });
CaisseSchema.index({ statut: 1 });

// Méthode pour mettre à jour le nombre de membres
CaisseSchema.methods.updateMembresCount = function(femmes: number, hommes: number) {
  this.femmes = femmes;
  this.hommes = hommes;
  this.totalMembres = femmes + hommes;
};

export default mongoose.model<ICaisse>('Caisse', CaisseSchema);
