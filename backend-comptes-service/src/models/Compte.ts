import mongoose, { Schema, Document } from 'mongoose';

export interface ICompte extends Document {
  nom: string;
  statut: 'actif' | 'inactif';
  description?: string;
  dateCreation: Date;
  userId: mongoose.Types.ObjectId;
}

const CompteSchema: Schema = new Schema({
  nom: { type: String, required: true, enum: ['LEKET', 'CONDAMNÉ', 'NATT'] },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  description: { type: String },
  dateCreation: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<ICompte>('Compte', CompteSchema);
