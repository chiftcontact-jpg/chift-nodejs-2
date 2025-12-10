import React, { useState } from 'react';
import { X, User, Mail, Phone, Shield, MapPin, CreditCard, Cake, Droplet, GraduationCap, Briefcase, Globe, Home, PlusCircle } from 'lucide-react';

interface NouvelUtilisateurModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (utilisateur: UtilisateurFormData) => void;
}

export interface BeneficiaireFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lienParente: string;
}

export interface UtilisateurFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  nationalite: string;
  villeResidence: string;
  adresse: string;
  dateNaissance: string;
  groupeSanguin: string;
  cni: string;
  niveauEducation: string;
  niveauEducationAutre: string;
  profession: string;
  role: 'ADMIN' | 'AGENT' | 'MAKER' | 'ADHERENT' | 'SUPERVISEUR' | '';
  beneficiaires: BeneficiaireFormData[];
}

const createEmptyBeneficiaire = (): BeneficiaireFormData => ({
  nom: '',
  prenom: '',
  dateNaissance: '',
  lienParente: ''
});

export const NouvelUtilisateurModal: React.FC<NouvelUtilisateurModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<UtilisateurFormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    nationalite: '',
    villeResidence: '',
    adresse: '',
    dateNaissance: '',
    groupeSanguin: '',
    cni: '',
    niveauEducation: '',
    niveauEducationAutre: '',
    profession: '',
    role: '',
    beneficiaires: [createEmptyBeneficiaire()]
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UtilisateurFormData, string>>>({});
  const steps = [
    'Contact',
    'Identité',
    'Profession',
    'Bénéficiaires',
    'Rôle'
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof UtilisateurFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UtilisateurFormData, string>> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!/^[0-9+\s()-]+$/.test(formData.telephone)) {
      newErrors.telephone = 'Numéro invalide';
    }
    if (!formData.role) newErrors.role = 'Le rôle est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        nationalite: '',
        villeResidence: '',
        adresse: '',
        dateNaissance: '',
        groupeSanguin: '',
        cni: '',
        niveauEducation: '',
        niveauEducationAutre: '',
        profession: '',
        role: '',
        beneficiaires: [createEmptyBeneficiaire()]
      });
      setErrors({});
      setCurrentStep(0);
      onClose();
    }
  };

  const handleNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleBeneficiaireChange = (
    index: number,
    field: keyof BeneficiaireFormData,
    value: string
  ) => {
    setFormData(prev => {
      const beneficiaires = [...prev.beneficiaires];
      beneficiaires[index] = {
        ...beneficiaires[index],
        [field]: value
      };
      return {
        ...prev,
        beneficiaires
      };
    });
  };

  const handleAddBeneficiaire = () => {
    setFormData(prev => ({
      ...prev,
      beneficiaires: [...prev.beneficiaires, createEmptyBeneficiaire()]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            {/* Section: Informations de contact */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Entrez le prénom"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.prenom ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Entrez le nom"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.nom ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemple@email.com"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Téléphone WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+221 77 123 45 67"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.telephone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.telephone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                  )}
                </div>

                {/* Nationalité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationalité
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="nationalite"
                      value={formData.nationalite}
                      onChange={handleChange}
                      placeholder="Ex: Sénégalaise"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Ville de résidence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville de résidence
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="villeResidence"
                      value={formData.villeResidence}
                      onChange={handleChange}
                      placeholder="Ex: Dakar"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Adresse complète"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            {/* Section: Informations personnelles */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date de naissance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <div className="relative">
                    <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Groupe sanguin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Groupe sanguin
                  </label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="groupeSanguin"
                      value={formData.groupeSanguin}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      <option value="">Sélectionner</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Informations administratives */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations administratives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CNI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNI
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="cni"
                      value={formData.cni}
                      onChange={handleChange}
                      placeholder="Numéro CNI"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            {/* Section: Informations professionnelles */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations professionnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Niveau d'éducation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d'éducation
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="niveauEducation"
                      value={formData.niveauEducation}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Aucun">Aucun</option>
                      <option value="Primaire">Primaire</option>
                      <option value="Collège">Collège</option>
                      <option value="Lycée">Lycée</option>
                      <option value="Bac">Bac</option>
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Doctorat">Doctorat</option>
                      <option value="Coraniques">Études coraniques</option>
                      <option value="Alphabétisation">Alphabétisation</option>
                      <option value="AUTRE">Autre (à préciser)</option>
                    </select>
                  </div>
                  {formData.niveauEducation === 'AUTRE' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Précisez le niveau d'étude
                      </label>
                      <input
                        type="text"
                        name="niveauEducationAutre"
                        value={formData.niveauEducationAutre}
                        onChange={handleChange}
                        placeholder="Entrez le niveau d'étude"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      placeholder="Ex: Commerçant(e)"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            {/* Section: Bénéficiaires */}
            <div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tableau des bénéficiaires</h3>
                <button
                  type="button"
                  onClick={handleAddBeneficiaire}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-teal-500 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Ajouter un bénéficiaire
                </button>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Prénom</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Nom</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Date de naissance</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Lien de parenté</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {formData.beneficiaires.map((beneficiaire, index) => (
                      <tr key={index} className="divide-x divide-gray-200">
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={beneficiaire.prenom}
                            onChange={(e) => handleBeneficiaireChange(index, 'prenom', e.target.value)}
                            placeholder="Prénom"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={beneficiaire.nom}
                            onChange={(e) => handleBeneficiaireChange(index, 'nom', e.target.value)}
                            placeholder="Nom"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={beneficiaire.dateNaissance}
                            onChange={(e) => handleBeneficiaireChange(index, 'dateNaissance', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={beneficiaire.lienParente}
                            onChange={(e) => handleBeneficiaireChange(index, 'lienParente', e.target.value)}
                            placeholder="Ex: Fils, Fille, Conjoint..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Section: Rôle et accès */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rôle et accès</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Rôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez un rôle</option>
                      <option value="ADMIN">Administrateur</option>
                      <option value="AGENT">Agent</option>
                      <option value="SUPERVISEUR">Superviseur</option>
                      <option value="MAKER">Maker</option>
                      <option value="ADHERENT">Adhérent</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Info: Mot de passe envoyé par email */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Configuration du mot de passe</h4>
                  <p className="text-sm text-blue-700">
                    L'utilisateur recevra un email de bienvenue avec un lien sécurisé pour définir son propre mot de passe. Le lien sera valide pendant 7 jours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Nouvel Utilisateur</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-8">
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center min-w-[80px]">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                          index <= currentStep ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700 text-center">{step}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-teal-500' : 'bg-gray-200'}`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {renderStepContent()}

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <div className="flex items-center gap-3">
                  {!isFirstStep && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Précédent
                    </button>
                  )}
                  {!isLastStep ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Créer l'utilisateur
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
