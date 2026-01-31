import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  nom: string;
  statut: 'actif' | 'inactif';
  description?: string;
  dateCreation: Date;
  userId: mongoose.Types.ObjectId;
  comptesAssocies: mongoose.Types.ObjectId[];
}

const ServiceSchema: Schema = new Schema({
  nom: { type: String, required: true, enum: ['SOKHLA', 'LEBB'] },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  description: { type: String },
  dateCreation: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comptesAssocies: [{ type: Schema.Types.ObjectId, ref: 'Compte' }]
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);
