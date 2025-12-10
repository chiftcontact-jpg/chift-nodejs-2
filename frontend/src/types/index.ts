export interface Adherent {
  _id: string
  nom: string
  prenom: string
  telephone: string
  email?: string
  cni?: string
  adresse: string
  region: string
  departement: string
  commune: string
  dateNaissance: string
  profession?: string
  statut: 'actif' | 'inactif' | 'suspendu'
  numeroAdherent: string
  typeAdherent: 'communautaire' | 'individuel'
  compteChift: {
    numeroCompte: string
    solde: number
    dateOuverture: string
    statut: 'actif' | 'inactif' | 'bloqué'
  }
  carteNFC?: {
    numeroSerie: string
    dateEmission: string
    dateRecuperation?: string
    mutuelleRecuperation?: string
    statut: 'active' | 'perdue' | 'bloquée'
  }
  csu: {
    numeroCSU: string
    dateActivation: string
    statut: 'actif' | 'inactif' | 'suspendu'
  }
  mecanismeEndogene?: {
    type: 'tontine' | 'natt' | 'caisse_solidaire' | 'autre' | 'aucun'
    nom?: string
    montantCotisation?: number
    frequenceCotisation?: 'journalier' | 'hebdomadaire' | 'mensuel'
  }
  createdAt: string
}

export interface Souscription {
  _id: string
  numeroSouscription: string
  typeSouscription: 'individuelle' | 'communautaire'
  statut: 'en_cours' | 'completée' | 'annulée' | 'en_attente'
  etapeActuelle: 'collecte' | 'enrolement' | 'validation' | 'activation' | 'terminée'
  questionnaire: {
    possedeMecanismeEndogene: boolean
    typeMecanisme?: string
    faitPartieCommunaute: boolean
    souhaiteCreerCommunaute?: boolean
    souhaiteEtreAgentCommercial?: boolean
    activiteProfessionnelle?: string
    revenusEstimes?: string
    objectifsFinanciers?: string[]
  }
  packageSouscrit: {
    compteChift: boolean
    csu: boolean
    carteNFC: boolean
    accesCredit: {
      nano: boolean
      micro: boolean
    }
    mobileMoney: boolean
  }
  dateCollecte: string
  dateEnrolement?: string
  dateValidation?: string
  dateActivation?: string
  createdAt: string
}

export interface EnrollmentFormData {
  // Informations personnelles
  nom: string
  prenom: string
  telephone: string
  email?: string
  cni?: string
  dateNaissance: string
  profession?: string
  
  // Localisation
  adresse: string
  region: string
  departement: string
  commune: string
  
  // Type d'adhésion
  typeAdherent: 'communautaire' | 'individuel'
  
  // Mécanisme endogène
  possedeMecanismeEndogene: boolean
  mecanismeEndogene?: {
    type: 'tontine' | 'natt' | 'caisse_solidaire' | 'autre' | 'aucun'
    nom?: string
    montantCotisation?: number
    frequenceCotisation?: 'journalier' | 'hebdomadaire' | 'mensuel'
  }
  
  // Communauté
  faitPartieCommunaute: boolean
  communauteId?: string
  
  // Aspirations
  souhaiteCreerCommunaute?: boolean
  souhaiteEtreAgentCommercial?: boolean
  objectifsFinanciers?: string[]
}

export const REGIONS_SENEGAL = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Diourbel',
  'Kaolack',
  'Fatick',
  'Kolda',
  'Louga',
  'Matam',
  'Tambacounda',
  'Ziguinchor',
  'Kaffrine',
  'Kédougou',
  'Sédhiou'
]

export const MECANISMES_ENDOGENES = [
  { value: 'tontine', label: 'Tontine' },
  { value: 'natt', label: 'Natt' },
  { value: 'caisse_solidaire', label: 'Caisse Solidaire' },
  { value: 'autre', label: 'Autre' },
  { value: 'aucun', label: 'Aucun' }
]

export const OBJECTIFS_FINANCIERS = [
  'Épargne',
  'Crédit',
  'Investissement',
  'Éducation',
  'Santé',
  'Commerce',
  'Agriculture'
]
