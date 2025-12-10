import mongoose, { Document, Schema } from 'mongoose';

export interface IReseau extends Document {
  nom: string;
  region: string;
  departement: string;
  commune: string;
  statut: 'active' | 'inactive' | 'suspendu';
  nombreCaisses: number;
  caisses: mongoose.Types.ObjectId[];
  president: {
    agent: mongoose.Types.ObjectId;
    nom: string;
    dateNomination: Date;
  };
  membres: Array<{
    agent: mongoose.Types.ObjectId;
    role: 'president' | 'secretaire' | 'tresorier' | 'membre';
    dateAdhesion: Date;
  }>;
  dateCreation: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReseauSchema = new Schema<IReseau>(
  {
    nom: { type: String, required: true },
    region: { type: String, required: true },
    departement: { type: String, required: true },
    commune: { type: String, required: true },
    statut: {
      type: String,
      enum: ['active', 'inactive', 'suspendu'],
      default: 'active'
    },
    nombreCaisses: { type: Number, default: 0 },
    caisses: [{
      type: Schema.Types.ObjectId,
      ref: 'Caisse'
    }],
    president: {
      agent: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
      },
      nom: { type: String, required: true },
      dateNomination: {
        type: Date,
        default: Date.now
      }
    },
    membres: [{
      agent: {
        type: Schema.Types.ObjectId,
        ref: 'Agent'
      },
      role: {
        type: String,
        enum: ['president', 'secretaire', 'tresorier', 'membre'],
        default: 'membre'
      },
      dateAdhesion: {
        type: Date,
        default: Date.now
      }
    }],
    dateCreation: { type: Date, default: Date.now },
    description: { type: String }
  },
  {
    timestamps: true
  }
);

// Index pour recherche
ReseauSchema.index({ nom: 1 });
ReseauSchema.index({ region: 1, commune: 1 });
ReseauSchema.index({ statut: 1 });

// Méthode pour mettre à jour le nombre de caisses
ReseauSchema.methods.updateNombreCaisses = function() {
  this.nombreCaisses = this.caisses.length;
};

export default mongoose.model<IReseau>('Reseau', ReseauSchema);
