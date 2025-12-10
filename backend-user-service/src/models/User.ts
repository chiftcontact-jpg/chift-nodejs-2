import mongoose, { Document, Schema } from 'mongoose';

// Rôles système
export type UserRole = 'ADMIN' | 'AGENT' | 'SUPERVISEUR' | 'MAKER' | 'ADHERENT';

// Multi-rôles : un utilisateur peut avoir plusieurs rôles dans différentes caisses
export interface IUserRole {
  role: UserRole;
  referenceId?: string; // ID de l'entité (Agent, Maker, Adherent)
  referenceModel?: 'Agent' | 'Maker' | 'Adherent';
  caisseId?: string; // ID de la caisse (pour MAKER et ADHERENT)
  dateAttribution: Date;
  actif: boolean;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  
  // Rôle principal (premier rôle attribué, utilisé pour l'authentification)
  rolePrincipal: UserRole;
  
  // Tous les rôles de l'utilisateur (multi-rôles)
  roles: IUserRole[];
  
  nom: string;
  prenom: string;
  telephone: string;
  whatsapp?: string; // Numéro WhatsApp pour les Makers
  cni?: string; // Pièce d'identité pour les Makers
  profession?: string; // Profession de l'utilisateur
  beneficiaires?: Array<{
    nom: string;
    prenom: string;
    relation: string;
    telephone?: string;
  }>; // Liste des bénéficiaires
  statut: 'actif' | 'inactif' | 'suspendu';
  
  // Permissions globales
  permissions: string[];
  
  // Sécurité
  derniereConnexion?: Date;
  tentativesConnexion: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // QR Code
  qrCode?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Méthodes helper
  hasRole(role: UserRole): boolean;
  isMakerInCaisse(caisseId: string): boolean;
  isAdherentInCaisse(caisseId: string): boolean;
  canBeMakerInCaisse(): boolean; // Vérifie si peut devenir Maker (max 1 caisse)
  getMakerCaisseId(): string | null;
  getAdherentCaisseIds(): string[];
}

const UserRoleSchema = new Schema<IUserRole>({
  role: {
    type: String,
    enum: ['ADMIN', 'AGENT', 'SUPERVISEUR', 'MAKER', 'ADHERENT'],
    required: true
  },
  referenceId: { type: String },
  referenceModel: {
    type: String,
    enum: ['Agent', 'Maker', 'Adherent']
  },
  caisseId: { type: String },
  dateAttribution: { type: Date, default: Date.now },
  actif: { type: Boolean, default: true }
}, { _id: false });

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    rolePrincipal: {
      type: String,
      enum: ['ADMIN', 'AGENT', 'SUPERVISEUR', 'MAKER', 'ADHERENT'],
      required: true,
      index: true
    },
    roles: {
      type: [UserRoleSchema],
      default: [],
      validate: {
        validator: function(roles: IUserRole[]) {
          // Règle 1: Un seul rôle MAKER maximum
          const makerRoles = roles.filter(r => r.role === 'MAKER' && r.actif);
          if (makerRoles.length > 1) return false;
          
          // Règle 2: MAKER doit avoir un caisseId
          const makerWithoutCaisse = makerRoles.find(r => !r.caisseId);
          if (makerWithoutCaisse) return false;
          
          // Règle 3: Si AGENT et MAKER, MAKER ne peut être que dans 1 caisse
          const hasAgent = roles.some(r => r.role === 'AGENT' && r.actif);
          if (hasAgent && makerRoles.length > 1) return false;
          
          return true;
        },
        message: 'Violation des règles métier : Un utilisateur ne peut être MAKER que dans une seule caisse'
      }
    },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    whatsapp: { type: String },
    cni: { type: String },
    profession: { type: String },
    beneficiaires: [{
      nom: { type: String, required: true },
      prenom: { type: String, required: true },
      relation: { type: String, required: true },
      telephone: { type: String }
    }],
    statut: {
      type: String,
      enum: ['actif', 'inactif', 'suspendu'],
      default: 'actif',
      index: true
    },
    
    // Permissions globales
    permissions: [{ type: String }],
    
    // Sécurité
    derniereConnexion: { type: Date },
    tentativesConnexion: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    
    // QR Code
    qrCode: { type: String }
  },
  {
    timestamps: true
  }
);

// Méthodes d'instance
UserSchema.methods.hasRole = function(role: UserRole): boolean {
  return this.roles.some((r: IUserRole) => r.role === role && r.actif);
};

UserSchema.methods.isMakerInCaisse = function(caisseId: string): boolean {
  return this.roles.some((r: IUserRole) => 
    r.role === 'MAKER' && r.caisseId === caisseId && r.actif
  );
};

UserSchema.methods.isAdherentInCaisse = function(caisseId: string): boolean {
  return this.roles.some((r: IUserRole) => 
    r.role === 'ADHERENT' && r.caisseId === caisseId && r.actif
  );
};

UserSchema.methods.canBeMakerInCaisse = function(): boolean {
  const makerRoles = this.roles.filter((r: IUserRole) => r.role === 'MAKER' && r.actif);
  return makerRoles.length === 0;
};

UserSchema.methods.getMakerCaisseId = function(): string | null {
  const makerRole = this.roles.find((r: IUserRole) => r.role === 'MAKER' && r.actif);
  return makerRole?.caisseId || null;
};

UserSchema.methods.getAdherentCaisseIds = function(): string[] {
  return this.roles
    .filter((r: IUserRole) => r.role === 'ADHERENT' && r.actif)
    .map((r: IUserRole) => r.caisseId)
    .filter((id: string | undefined): id is string => !!id);
};

// Index composés
UserSchema.index({ rolePrincipal: 1, statut: 1 });
UserSchema.index({ email: 1, statut: 1 });
UserSchema.index({ 'roles.role': 1, 'roles.actif': 1 });
UserSchema.index({ 'roles.caisseId': 1, 'roles.role': 1 });

export default mongoose.model<IUser>('User', UserSchema);
