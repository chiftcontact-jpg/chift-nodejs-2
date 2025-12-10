import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Building2, 
  Users, 
  Calendar,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';
import { caisseAPI } from '../lib/api';

interface Caisse {
  _id: string;
  nom: string;
  code: string;
  type: 'LEKKET' | 'CLASSIQUE';
  statut: 'active' | 'inactive' | 'suspendue';
  badge?: string;
  region: string;
  departement: string;
  commune: string;
  arrondissement?: string;
  nombreMembres: number;
  femmesActives?: number;
  hommesActifs?: number;
  montantMinimumCotisation: number;
  frequence?: string;
  jour?: string;
  dateCreation: string;
}

export const CaissesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [caisses, setCaisses] = useState<Caisse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statutFilter, setStatutFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchCaisses();
  }, [typeFilter, statutFilter]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const fetchCaisses = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (typeFilter !== 'all') filters.type = typeFilter;
      if (statutFilter !== 'all') filters.statut = statutFilter;

      const response = await caisseAPI.getAll(filters);
      if (response.data.success) {
        setCaisses(response.data.data.caisses);
      }
    } catch (error) {
      console.error('Erreur chargement caisses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette caisse ?')) return;

    try {
      await caisseAPI.delete(id);
      fetchCaisses();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'active' | 'inactive') => {
    try {
      await caisseAPI.changeStatus(id, newStatus);
      fetchCaisses();
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const filteredCaisses = caisses.filter(caisse =>
    caisse.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caisse.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caisse.commune.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'suspendue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'LEKKET'
      ? 'bg-purple-100 text-purple-700 border-purple-200'
      : 'bg-blue-100 text-blue-700 border-blue-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des caisses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-gray-50">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestion des Caisses</h1>
              <p className="text-teal-100 mt-2">Vue d'ensemble et gestion complète de toutes les caisses</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <p className="text-sm text-teal-100">Total</p>
              <p className="text-3xl font-bold text-white">{filteredCaisses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Classiques</p>
                <p className="text-2xl font-bold text-gray-900">
                  {caisses.filter(c => c.type === 'CLASSIQUE').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lekket</p>
                <p className="text-2xl font-bold text-gray-900">
                  {caisses.filter(c => c.type === 'LEKKET').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {caisses.filter(c => c.statut === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Membres Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {caisses.reduce((sum, c) => sum + c.nombreMembres, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres modernisés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Recherche avec icône améliorée */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par nom, code ou commune..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtres avec icônes */}
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="appearance-none px-5 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white cursor-pointer font-medium"
                  >
                    <option value="all">📦 Tous types</option>
                    <option value="CLASSIQUE">🏢 Classique</option>
                    <option value="LEKKET">💜 Lekket</option>
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={statutFilter}
                    onChange={(e) => setStatutFilter(e.target.value)}
                    className="appearance-none px-5 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white cursor-pointer font-medium"
                  >
                    <option value="all">🔘 Tous statuts</option>
                    <option value="active">✅ Active</option>
                    <option value="inactive">⭕ Inactive</option>
                    <option value="suspendue">🚫 Suspendue</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des caisses - Design carte amélioré */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCaisses.map((caisse) => (
            <div
              key={caisse._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => navigate(`/caisse/${caisse._id}`)}
            >
              {/* Barre de couleur selon le type */}
              <div className={`h-2 ${caisse.type === 'LEKKET' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-teal-500'}`} />
              
              <div className="p-6">
                {/* En-tête modernisé */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${caisse.type === 'LEKKET' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-teal-500'}`}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{caisse.nom}</h3>
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block mt-1">
                          {caisse.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getTypeColor(caisse.type)} shadow-sm`}>
                        {caisse.type}
                      </span>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatutColor(caisse.statut)} shadow-sm`}>
                        {caisse.statut === 'active' ? '✓ Active' : caisse.statut === 'inactive' ? '○ Inactive' : '✕ Suspendue'}
                      </span>
                      {caisse.badge && (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm">
                          {caisse.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu actions */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === caisse._id ? null : caisse._id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {openMenuId === caisse._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/caisse/${caisse._id}`);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" />
                            Voir les détails
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/caisse/${caisse._id}/edit`);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newStatus = caisse.statut === 'active' ? 'inactive' : 'active';
                              handleStatusChange(caisse._id, newStatus);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {caisse.statut === 'active' ? (
                              <>
                                <Lock className="w-4 h-4" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4" />
                                Activer
                              </>
                            )}
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(caisse._id);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations avec design moderne */}
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {/* Localisation */}
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-3 border border-teal-100">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-teal-600" />
                      <p className="text-xs font-semibold text-teal-800 uppercase tracking-wide">Localisation</p>
                    </div>
                    <p className="font-bold text-gray-900 text-base">{caisse.commune}</p>
                    <p className="text-sm text-gray-600">{caisse.departement} • {caisse.region}</p>
                  </div>

                  {/* Membres et Cotisation */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Membres */}
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-3 border border-orange-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-orange-600" />
                        <p className="text-xs font-semibold text-orange-800 uppercase tracking-wide">Membres</p>
                      </div>
                      <p className="font-bold text-gray-900 text-2xl">{caisse.nombreMembres}</p>
                      {caisse.femmesActives !== undefined && caisse.hommesActifs !== undefined && (
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded font-semibold">
                            {caisse.femmesActives} F
                          </span>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-semibold">
                            {caisse.hommesActifs} H
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cotisation */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-green-600" />
                        <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">Cotisation</p>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">{caisse.montantMinimumCotisation.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">FCFA {caisse.frequence && `• ${caisse.frequence}`}</p>
                    </div>
                  </div>
                </div>

                {/* Footer avec date */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Créée le {new Date(caisse.dateCreation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {caisse.jour && (
                    <div className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">
                      {caisse.jour}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCaisses.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune caisse trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};
