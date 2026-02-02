import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Users as UsersIcon,
  Plus,
  X
} from 'lucide-react';
import { userAPI } from '../lib/api';
import { getRegions, getDepartements, SENEGAL_GEOGRAPHIC_DATA } from '../data/geography';
import type { User as UserType } from '../store/authStore';

export const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nom: '',
    prenom: '',
    telephone: '',
    whatsapp: '',
    cni: '',
    profession: '',
    rolePrincipal: 'UTILISATEUR' as const,
    statut: 'actif' as const,
    region: '',
    departement: '',
    commune: '',
  });

  const [regions] = useState(getRegions());
  const [departements, setDepartements] = useState<any[]>([]);
  const [beneficiaires, setBeneficiaires] = useState<Array<{
    nom: string;
    prenom: string;
    relation: string;
    telephone: string;
  }>>([]);

  useEffect(() => {
    if (formData.region) {
      setDepartements(getDepartements(formData.region));
    }
  }, [formData.region]);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getById(id!);
      
      if (response.data.success) {
        const user = response.data.data;
        
        // Trouver le code de la région à partir du nom
        let regionCode = '';
        if (user.region) {
          const foundRegion = Object.entries(SENEGAL_GEOGRAPHIC_DATA).find(
            ([_, data]) => (data as any).nom === user.region
          );
          if (foundRegion) regionCode = foundRegion[0];
        }

        setFormData({
          username: user.username,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          telephone: user.telephone,
          whatsapp: user.whatsapp || '',
          cni: user.cni || '',
          profession: user.profession || '',
          rolePrincipal: user.rolePrincipal,
          statut: user.statut,
          region: regionCode,
          departement: user.departement || '',
          commune: user.commune || '',
        });
        setBeneficiaires(user.beneficiaires || []);
      }
    } catch (error) {
      console.error('Erreur chargement adhérent:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      setSaving(true);
      
      // Convertir le code région en nom pour le backend
      const regionName = formData.region ? (SENEGAL_GEOGRAPHIC_DATA as any)[formData.region]?.nom : '';

      await userAPI.update(id, {
        ...formData,
        region: regionName,
        beneficiaires: beneficiaires.filter(b => b.nom && b.prenom && b.relation)
      });
      
      alert('✅ Adhérent modifié avec succès');
      navigate(`/utilisateur/${id}`);
    } catch (error: any) {
      console.error('Erreur modification adhérent:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Impossible de modifier l\'adhérent'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addBeneficiaire = () => {
    setBeneficiaires(prev => [...prev, { nom: '', prenom: '', relation: '', telephone: '' }]);
  };

  const removeBeneficiaire = (index: number) => {
    setBeneficiaires(prev => prev.filter((_, i) => i !== index));
  };

  const updateBeneficiaire = (index: number, field: string, value: string) => {
    setBeneficiaires(prev => prev.map((b, i) => 
      i === index ? { ...b, [field]: value } : b
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/utilisateur/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier l'adhérent</h1>
            <p className="text-sm text-gray-500 mt-1">Mettre à jour les informations</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              Informations de base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-teal-600" />
              Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Identité, Profession et Localisation */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-600" />
              Identité, Profession et Localisation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNI
                </label>
                <input
                  type="text"
                  name="cni"
                  value={formData.cni}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une région</option>
                  {regions.map(r => (
                    <option key={r.code} value={r.code}>{r.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département
                </label>
                <select
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                  disabled={!formData.region}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50"
                >
                  <option value="">Sélectionner un département</option>
                  {departements.map(d => (
                    <option key={d.code} value={d.nom}>{d.nom}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commune
                </label>
                <input
                  type="text"
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  placeholder="Ex: Parcelles Assainies"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Rôle et Statut */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" />
              Rôle et Statut
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle principal
                </label>
                <select
                  name="rolePrincipal"
                  value={formData.rolePrincipal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="ADMIN">Administrateur</option>
                  <option value="AGENT">Agent</option>
                  <option value="ADHERENT">Adhérent</option>
                  <option value="SUPERVISEUR">Superviseur</option>
                  <option value="MAKER">Maker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="suspendu">Suspendu</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bénéficiaires */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-teal-600" />
                Bénéficiaires
              </h2>
              <button
                type="button"
                onClick={addBeneficiaire}
                className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            {beneficiaires.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucun bénéficiaire ajouté
              </p>
            ) : (
              <div className="space-y-4">
                {beneficiaires.map((beneficiaire, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">
                        Bénéficiaire {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeBeneficiaire(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Prénom
                        </label>
                        <input
                          type="text"
                          value={beneficiaire.prenom}
                          onChange={(e) => updateBeneficiaire(index, 'prenom', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={beneficiaire.nom}
                          onChange={(e) => updateBeneficiaire(index, 'nom', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Relation
                        </label>
                        <input
                          type="text"
                          value={beneficiaire.relation}
                          onChange={(e) => updateBeneficiaire(index, 'relation', e.target.value)}
                          placeholder="Ex: Épouse, Fils, etc."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="text"
                          value={beneficiaire.telephone}
                          onChange={(e) => updateBeneficiaire(index, 'telephone', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/utilisateur/${id}`)}
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
