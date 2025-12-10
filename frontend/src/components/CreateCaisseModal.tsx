import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateCaisseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CaisseFormData) => void;
  communauteInfo: {
    id: string;
    nom: string;
    region: string;
    departement: string;
  };
}

export interface CaisseFormData {
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
}

export const CreateCaisseModal: React.FC<CreateCaisseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  communauteInfo
}) => {
  const [formData, setFormData] = useState<CaisseFormData>({
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
    tauxInteret: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'femmesActives' || name === 'hommesActifs' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de la caisse est requis';
    }
    if (!formData.dateCreationPhysique) {
      newErrors.dateCreationPhysique = 'La date de création est requise';
    }
    if (formData.femmesActives < 0) {
      newErrors.femmesActives = 'Nombre invalide';
    }
    if (formData.hommesActifs < 0) {
      newErrors.hommesActifs = 'Nombre invalide';
    }
    if (!formData.modeleUtilise) {
      newErrors.modeleUtilise = 'Le modèle est requis';
    }
    if (!formData.frequence) {
      newErrors.frequence = 'La fréquence est requise';
    }
    if (!formData.jour) {
      newErrors.jour = 'Le jour est requis';
    }
    if (!formData.dateEcheance) {
      newErrors.dateEcheance = 'La date d\'échéance est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
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
      tauxInteret: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Créer une nouvelle caisse</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Informations de localisation */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Région</p>
              <p className="font-medium text-gray-900">{communauteInfo.region}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Département</p>
              <p className="font-medium text-gray-900">{communauteInfo.departement}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Commune</p>
              <p className="font-medium text-gray-900">{communauteInfo.nom}</p>
            </div>
          </div>

          {/* Informations générales */}
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

          {/* Boutons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Créer la caisse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
