import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Settings, Plus, MoreVertical, ToggleLeft, ToggleRight, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { comptesAPI, servicesAPI, authAPI } from '../lib/api';

interface Compte {
  _id: string;
  nom: string;
  statut: 'actif' | 'inactif';
  createdAt: string;
}

interface Service {
  _id: string;
  nom: string;
  statut: 'actif' | 'inactif';
  createdAt: string;
}

export const ComptesServicesPage: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'comptes' | 'services'>('comptes');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [comptes, setComptes] = useState<Compte[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: comptesData } = await comptesAPI.getAll();
      setComptes(comptesData.data || []);
      
      const { data: servicesData } = await servicesAPI.getAll();
      setServices(servicesData.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      await authAPI.login(authForm.email, authForm.password);
      setIsAuthenticated(true);
    } catch (error: any) {
      setAuthError(error.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatutCompte = async (id: string, currentStatut: string) => {
    const newStatut = currentStatut === 'actif' ? 'inactif' : 'actif';
    try {
      await comptesAPI.updateStatus(id, newStatut);
      setComptes(comptes.map(c => 
        c._id === id ? { ...c, statut: newStatut as 'actif' | 'inactif' } : c
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Authentification Requise</h2>
            <p className="text-gray-500 mt-2">
              Veuillez confirmer votre identité pour accéder aux comptes et services CHIFT.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identifiant
              </label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-red-500 text-sm text-center font-medium">{authError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">A</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre de comptes</p>
                <p className="text-3xl font-bold text-gray-900">{comptes.length}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre de services</p>
                <p className="text-3xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('comptes')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'comptes'
                ? 'bg-primary-600 text-white rounded-t-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Comptes
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'services'
                ? 'bg-primary-600 text-white rounded-t-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Services
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            {activeTab === 'comptes' && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Comptes</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                    Nouveau compte
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">COMPTE</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STATUT</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CRÉATION</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {comptes.map((compte) => (
                        <tr key={compte._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">{compte.nom}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleStatutCompte(compte._id, compte.statut)}
                              className="flex items-center"
                            >
                              {compte.statut === 'actif' ? (
                                <ToggleRight className="w-10 h-10 text-green-500" />
                              ) : (
                                <ToggleLeft className="w-10 h-10 text-red-500" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(compte.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {comptes.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            Aucun compte trouvé pour cet utilisateur.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Services</h2>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors">
                      <Plus className="w-5 h-5" />
                      Ajouter un compte au service
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                      <Plus className="w-5 h-5" />
                      Nouveau service
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SERVICE</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STATUT</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CRÉATION</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {services.map((service) => (
                        <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">{service.nom}</span>
                          </td>
                          <td className="px-6 py-4">
                            {service.statut === 'actif' ? (
                              <ToggleRight className="w-10 h-10 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-10 h-10 text-red-500" />
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(service.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
