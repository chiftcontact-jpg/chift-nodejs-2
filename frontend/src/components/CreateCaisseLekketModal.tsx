import React, { useState, useEffect } from 'react';
import { X, Plus, Users } from 'lucide-react';
import { getRegions, getDepartements, getArrondissements, getCommunes, SENEGAL_GEOGRAPHIC_DATA } from '../data/geography';
import { agentAPI } from '../lib/api';

// Type pour les données géographiques
const SENEGAL_GEO = SENEGAL_GEOGRAPHIC_DATA as any;

interface CreateCaisseLekketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CaisseLekketFormData) => void;
}

export interface CaisseLekketFormData {
  nom: string;
  dateCreationPhysique: string;
  femmesActives: number;
  hommesActifs: number;
  modeleUtilise: string;
  frequence: string;
  jour: string;
  echeanceEvenement: string;
  dateEcheance: string;
  solidarite?: string;
  tauxInteret?: string;
  region: string;
  departement: string;
  arrondissement: string;
  commune: string;
  // Agent
  agentOption: 'existing' | 'new';
  agentId?: string;
  newAgent?: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    whatsapp?: string;
    cni?: string;
  };
}

export const CreateCaisseLekketModal: React.FC<CreateCaisseLekketModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<CaisseLekketFormData>({
    nom: '',
    dateCreationPhysique: '',
    femmesActives: 0,
    hommesActifs: 0,
    modeleUtilise: '',
    frequence: '',
    jour: '',
    echeanceEvenement: '',
    dateEcheance: '',
    solidarite: '',
    tauxInteret: '',
    region: '',
    departement: '',
    arrondissement: '',
    commune: '',
    agentOption: 'existing',
    agentId: '',
    newAgent: {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      whatsapp: '',
      cni: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  
  // États pour les sélections en cascade
  const [regions, setRegions] = useState<string[]>([]);
  const [departements, setDepartements] = useState<any[]>([]);
  const [arrondissements, setArrondissements] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);

  // Charger les régions et agents au montage
  useEffect(() => {
    setRegions(getRegions().map(r => r.code));
    
    // Charger la liste des agents
    agentAPI.getAll().then(response => {
      if (response?.data?.success) {
        setAgents(response.data.data || []);
      }
    }).catch(error => {
      console.error('Erreur chargement agents:', error);
    });
  }, []);

  // Charger les départements quand la région change
  useEffect(() => {
    if (formData.region) {
      const depts = getDepartements(formData.region);
      setDepartements(depts);
      setArrondissements([]);
      setCommunes([]);
      setFormData(prev => ({ ...prev, departement: '', arrondissement: '', commune: '' }));
    }
  }, [formData.region]);

  // Charger les arrondissements quand le département change
  useEffect(() => {
    if (formData.region && formData.departement) {
      const arrs = getArrondissements(formData.region, formData.departement);
      setArrondissements(arrs);
      setCommunes([]);
      setFormData(prev => ({ ...prev, arrondissement: '', commune: '' }));
    }
  }, [formData.departement, formData.region]);

  // Charger les communes quand l'arrondissement change
  useEffect(() => {
    if (formData.region && formData.departement && formData.arrondissement) {
      // Trouver le code de l'arrondissement à partir de son nom
      const arr = arrondissements.find(a => a.nom === formData.arrondissement);
      if (arr) {
        const coms = getCommunes(formData.region, formData.departement, arr.code);
        setCommunes(coms);
        setFormData(prev => ({ ...prev, commune: '' }));
      }
    }
  }, [formData.arrondissement, formData.region, formData.departement, arrondissements]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'femmesActives' || name === 'hommesActifs' ? parseInt(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Localisation
      if (!formData.region) newErrors.region = 'La région est requise';
      if (!formData.departement) newErrors.departement = 'Le département est requis';
      if (!formData.arrondissement) newErrors.arrondissement = 'L\'arrondissement est requis';
      if (!formData.commune) newErrors.commune = 'La commune est requise';
    } else if (step === 2) {
      // Informations de base
      if (!formData.nom.trim()) newErrors.nom = 'Le nom de la caisse est requis';
      if (!formData.dateCreationPhysique) newErrors.dateCreationPhysique = 'La date de création est requise';
      if (formData.femmesActives < 0) newErrors.femmesActives = 'Nombre invalide';
      if (formData.hommesActifs < 0) newErrors.hommesActifs = 'Nombre invalide';
    } else if (step === 3) {
      // Modalités de fonctionnement
      if (!formData.modeleUtilise) newErrors.modeleUtilise = 'Le modèle est requis';
      if (!formData.frequence) newErrors.frequence = 'La fréquence est requise';
      if (!formData.jour) newErrors.jour = 'Le jour est requis';
      if (!formData.dateEcheance) newErrors.dateEcheance = 'La date d\'échéance est requise';
    } else if (step === 4) {
      // Agent - validation uniquement si on crée un nouvel agent
      if (formData.agentOption === 'new' && formData.newAgent) {
        if (!formData.newAgent.nom.trim()) newErrors['newAgent.nom'] = 'Le nom est requis';
        if (!formData.newAgent.prenom.trim()) newErrors['newAgent.prenom'] = 'Le prénom est requis';
        if (!formData.newAgent.telephone.trim()) newErrors['newAgent.telephone'] = 'Le téléphone est requis';
        if (!formData.newAgent.email.trim()) newErrors['newAgent.email'] = 'L\'email est requis';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      nom: '',
      dateCreationPhysique: '',
      femmesActives: 0,
      hommesActifs: 0,
      modeleUtilise: '',
      frequence: '',
      jour: '',
      echeanceEvenement: '',
      dateEcheance: '',
      solidarite: '',
      tauxInteret: '',
      region: '',
      departement: '',
      arrondissement: '',
      commune: '',
      agentOption: 'existing',
      agentId: '',
      newAgent: {
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        whatsapp: '',
        cni: ''
      }
    });
    setErrors({});
    setCurrentStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Créer une nouvelle caisse</h2>
            <p className="text-sm text-gray-500 mt-1">Étape {currentStep} sur 4</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Indicateur de progression */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                  step < currentStep ? 'bg-teal-600 text-white' :
                  step === currentStep ? 'bg-teal-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-teal-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mb-4">
            <span>Localisation</span>
            <span>Informations</span>
            <span>Modalités</span>
            <span>Agent</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Étape 1: Localisation Administrative */}
          {currentStep === 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teal-600 mb-4">Localisation Administrative</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région <span className="text-red-500">*</span>
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.region ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">Sélectionner une région</option>
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {SENEGAL_GEO[region].nom}
                    </option>
                  ))}
                </select>
                {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département <span className="text-red-500">*</span>
                </label>
                <select
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                  disabled={!formData.region}
                  className={`w-full px-3 py-2 border ${errors.departement ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">Sélectionner un département</option>
                  {departements.map(dept => (
                    <option key={dept.code} value={dept.code}>
                      {dept.nom}
                    </option>
                  ))}
                </select>
                {errors.departement && <p className="text-red-500 text-xs mt-1">{errors.departement}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrondissement <span className="text-red-500">*</span>
                </label>
                <select
                  name="arrondissement"
                  value={formData.arrondissement}
                  onChange={handleChange}
                  disabled={!formData.departement}
                  className={`w-full px-3 py-2 border ${errors.arrondissement ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">Sélectionner un arrondissement</option>
                  {arrondissements.map(arr => (
                    <option key={arr.code} value={arr.nom}>
                      {arr.nom}
                    </option>
                  ))}
                </select>
                {errors.arrondissement && <p className="text-red-500 text-xs mt-1">{errors.arrondissement}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commune <span className="text-red-500">*</span>
                </label>
                <select
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  disabled={!formData.arrondissement}
                  className={`w-full px-3 py-2 border ${errors.commune ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">Sélectionner une commune</option>
                  {communes.map(com => (
                    <option key={com.code} value={com.nom}>
                      {com.nom}
                    </option>
                  ))}
                </select>
                {errors.commune && <p className="text-red-500 text-xs mt-1">{errors.commune}</p>}
              </div>
            </div>
          </div>
          )}

          {/* Étape 2: Informations générales */}
          {currentStep === 2 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teal-600 mb-4">Informations générales</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la caisse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Ex: MBOOTAY GUI"
                  className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date création physique <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateCreationPhysique"
                  value={formData.dateCreationPhysique}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.dateCreationPhysique ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
                {errors.dateCreationPhysique && <p className="text-red-500 text-xs mt-1">{errors.dateCreationPhysique}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Femmes actives <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="femmesActives"
                  value={formData.femmesActives}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className={`w-full px-3 py-2 border ${errors.femmesActives ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
                {errors.femmesActives && <p className="text-red-500 text-xs mt-1">{errors.femmesActives}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hommes actifs <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="hommesActifs"
                  value={formData.hommesActifs}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className={`w-full px-3 py-2 border ${errors.hommesActifs ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
                {errors.hommesActifs && <p className="text-red-500 text-xs mt-1">{errors.hommesActifs}</p>}
              </div>
            </div>
          </div>
          )}

          {/* Étape 3: Modalités de fonctionnement */}
          {currentStep === 3 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teal-600 mb-4">Modalités de fonctionnement</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modèle utilisé <span className="text-red-500">*</span>
                </label>
                <select
                  name="modeleUtilise"
                  value={formData.modeleUtilise}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.modeleUtilise ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">Sélectionner un modèle</option>
                  <option value="Djambal">Djambal</option>
                  <option value="Madial">Madial</option>
                  <option value="Avec">Avec</option>
                </select>
                {errors.modeleUtilise && <p className="text-red-500 text-xs mt-1">{errors.modeleUtilise}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fréquence de collecte <span className="text-red-500">*</span>
                </label>
                <select
                  name="frequence"
                  value={formData.frequence}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.frequence ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">Sélectionner</option>
                  <option value="quotidien">Quotidien</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                </select>
                {errors.frequence && <p className="text-red-500 text-xs mt-1">{errors.frequence}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jour de collecte <span className="text-red-500">*</span>
                </label>
                <select
                  name="jour"
                  value={formData.jour}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.jour ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">Sélectionner</option>
                  <option value="Lundi">Lundi</option>
                  <option value="Mardi">Mardi</option>
                  <option value="Mercredi">Mercredi</option>
                  <option value="Jeudi">Jeudi</option>
                  <option value="Vendredi">Vendredi</option>
                  <option value="Samedi">Samedi</option>
                  <option value="Dimanche">Dimanche</option>
                </select>
                {errors.jour && <p className="text-red-500 text-xs mt-1">{errors.jour}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Échéance événement
                </label>
                <input
                  type="text"
                  name="echeanceEvenement"
                  value={formData.echeanceEvenement}
                  onChange={handleChange}
                  placeholder="Ex: Korité, Tabaski..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'échéance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateEcheance"
                  value={formData.dateEcheance}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.dateEcheance ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
                {errors.dateEcheance && <p className="text-red-500 text-xs mt-1">{errors.dateEcheance}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Solidarité (optionnel)
                </label>
                <input
                  type="text"
                  name="solidarite"
                  value={formData.solidarite}
                  onChange={handleChange}
                  placeholder="Montant ou description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taux d'intérêt (%) (optionnel)
                </label>
                <input
                  type="text"
                  name="tauxInteret"
                  value={formData.tauxInteret}
                  onChange={handleChange}
                  placeholder="Ex: 5%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
          )}

          {/* Étape 4: Agent en charge */}
          {currentStep === 4 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teal-600 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Agent en charge de la caisse
            </h3>

            <div className="mb-4">
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="agentOption"
                    value="existing"
                    checked={formData.agentOption === 'existing'}
                    onChange={(e) => setFormData({ ...formData, agentOption: e.target.value as 'existing' | 'new' })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Affecter un agent existant</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="agentOption"
                    value="new"
                    checked={formData.agentOption === 'new'}
                    onChange={(e) => setFormData({ ...formData, agentOption: e.target.value as 'existing' | 'new' })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Créer un nouvel agent</span>
                </label>
              </div>
            </div>

            {formData.agentOption === 'existing' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sélectionner un agent
                </label>
                <select
                  value={formData.agentId}
                  onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Aucun agent (optionnel) --</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.nom} {agent.prenom} - {agent.telephone}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 border border-gray-200 rounded-lg p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.newAgent?.nom || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      newAgent: { ...formData.newAgent!, nom: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.newAgent?.prenom || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      newAgent: { ...formData.newAgent!, prenom: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.newAgent?.telephone || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      newAgent: { ...formData.newAgent!, telephone: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.newAgent?.email || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      newAgent: { ...formData.newAgent!, email: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={formData.newAgent?.whatsapp || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      newAgent: { ...formData.newAgent!, whatsapp: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNI (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.newAgent?.cni || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      newAgent: { ...formData.newAgent!, cni: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Annuler
            </button>
            
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                >
                  Précédent
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                >
                  Créer la caisse
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
