import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, CreditCard, Wallet, AlertTriangle, Send, MapPin } from 'lucide-react';
import { getRegions, getDepartements } from '../data/geography';

export const DemandeSokhlaChiftPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [regions] = useState(getRegions());
  const [departements, setDepartements] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    profession: '',
    region: '',
    departement: '',
    commune: '',
    montantSouhaite: '',
    projet: '',
    canalReception: ''
  });
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (formData.region) {
      setDepartements(getDepartements(formData.region));
    } else {
      setDepartements([]);
    }
  }, [formData.region]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'region') {
      setFormData(prev => ({ ...prev, departement: '' }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.montantSouhaite || !formData.canalReception) {
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('✅ Votre demande a été envoyée avec succès. Notre équipe vous contactera prochainement.');
      navigate('/');
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue lors de l\'envoi de votre demande.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.montantSouhaite && formData.canalReception && 
     formData.region && formData.departement &&
     parseFloat(formData.montantSouhaite) >= 501000 && 
     parseFloat(formData.montantSouhaite) <= 2000000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <button className="text-primary-600 hover:text-primary-700 px-4 py-2 font-medium">
              Déconnexion
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">DEMANDE SOKHLA</h1>
            <p className="text-gray-600">DEMANDE SOKHLA CHIFT</p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full font-semibold text-sm">
              1
            </div>
            <span className="font-medium text-gray-900">Montant de votre demande</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header Section */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full flex-shrink-0">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">SOKHLA CHIFT</h2>
              <p className="text-gray-600">Précisez le montant de votre nouvelle demande</p>
            </div>
          </div>

          {/* Montant demandé */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Montant demandé</h3>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (FCFA) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                  type="number"
                  name="montantSouhaite"
                  value={formData.montantSouhaite}
                  onChange={handleChange}
                  placeholder="Ex: 50000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-16"
                />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                FCFA
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Montant minimum : 501 000 FCFA - Montant maximum : 2 000 000 FCFA
            </p>
          </div>

          {/* Localisation */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">Localisation</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région <span className="text-red-500">*</span>
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Sélectionnez une région</option>
                  {regions.map(r => (
                    <option key={r.code} value={r.code}>{r.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département <span className="text-red-500">*</span>
                </label>
                <select
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                  disabled={!formData.region}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white disabled:opacity-50"
                >
                  <option value="">Sélectionnez un département</option>
                  {departements.map(d => (
                    <option key={d.code} value={d.nom}>{d.nom}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Canal de réception */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Canal de réception</h3>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment souhaitez-vous recevoir votre aide ? <span className="text-red-500">*</span>
            </label>
            <select
              name="canalReception"
              value={formData.canalReception}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Sélectionnez un canal</option>
              <option value="mobile_money">Mobile Money (Wave, Orange Money, Free Money)</option>
              <option value="virement">Virement bancaire</option>
              <option value="especes">Retrait en espèces</option>
              <option value="cheque">Chèque</option>
            </select>
          </div>

          {/* Error message */}
          {showError && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Champs obligatoires manquants</p>
                  <p className="text-sm text-yellow-800">
                    Veuillez remplir tous les champs marqués d'une étoile rouge (*) pour continuer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isFormValid
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Envoyer la demande
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
