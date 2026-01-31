import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus, MoreVertical, Users, Crown, Briefcase, UserCheck, Banknote, Shield, Edit, Trash2, Eye, Lock, Unlock, Phone, MapPin } from 'lucide-react';
import { NouvelUtilisateurModal, UtilisateurFormData } from '../components/NouvelUtilisateurModal';
import { type User, useAuthStore } from '../store/authStore';
import { userAPI } from '../lib/api';

export const UtilisateursPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<{
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
    recentUsers: number;
  } | null>(null);
  
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, [currentPage, roleFilter, itemsPerPage]);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (roleFilter !== 'all') filters.role = roleFilter;

      const response = await userAPI.getAll(filters);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pages);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await userAPI.getStatistics();
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      await userAPI.delete(userId);
      fetchUsers();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'actif' | 'inactif' | 'suspendu') => {
    try {
      await userAPI.changeStatus(userId, newStatus);
      fetchUsers();
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const handleCreateUser = async (userData: UtilisateurFormData) => {
    try {
      const newUserData = {
        username: userData.email.split('@')[0],
        email: userData.email,
        // Plus de mot de passe - sera défini par l'utilisateur via email
        rolePrincipal: userData.role as any,
        roles: [{
          role: userData.role as any,
          dateAttribution: new Date().toISOString(),
          actif: true
        }],
        nom: userData.nom,
        prenom: userData.prenom,
        telephone: userData.telephone,
        whatsapp: userData.telephone, // Utiliser le même numéro par défaut
        cni: userData.cni,
        adresse: userData.adresse,
        region: userData.region,
        departement: userData.departement,
        commune: userData.commune,
        dateNaissance: userData.dateNaissance,
        groupeSanguin: userData.groupeSanguin,
        profession: userData.profession,
        leket: userData.leket,
        csu: userData.csu,
        adhesion: userData.adhesion,
        beneficiaires: userData.beneficiaires
          .filter(b => b.nom && b.prenom) // Filtrer les bénéficiaires vides
          .map(b => ({
            nom: b.nom,
            prenom: b.prenom,
            relation: b.lienParente,
            telephone: '' // Le formulaire n'a pas de téléphone pour les bénéficiaires
          })),
        statut: 'actif' as const,
        permissions: []
      };
      
      await userAPI.create(newUserData);
      fetchUsers();
      setIsModalOpen(false);
      alert('✅ Utilisateur créé ! Un email de bienvenue a été envoyé avec un lien pour définir le mot de passe.');
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
    }
  };

  const stats = [
    { 
      label: 'Total Adhérents', 
      value: statistics?.total || 0, 
      icon: Users, 
      color: 'teal' 
    },
    { 
      label: 'Administrateurs', 
      value: statistics?.byRole['ADMIN'] || 0, 
      icon: Crown, 
      color: 'indigo' 
    },
    { 
      label: 'Agents', 
      value: statistics?.byRole['AGENT'] || 0, 
      icon: Briefcase, 
      color: 'blue' 
    },
    { 
      label: 'Superviseurs', 
      value: statistics?.byRole['SUPERVISEUR'] || 0, 
      icon: Shield, 
      color: 'amber' 
    },
    { 
      label: 'Makers', 
      value: statistics?.byRole['MAKER'] || 0, 
      icon: Banknote, 
      color: 'rose' 
    },
    { 
      label: 'Adhérents', 
      value: (statistics?.byRole['ADHERENT'] || 0) + (statistics?.byRole['USER'] || 0), 
      icon: UserCheck, 
      color: 'emerald' 
    }
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'AGENT': return 'Agent';
      case 'MAKER': return 'Maker';
      case 'UTILISATEUR':
      case 'ADHERENT': return 'Adhérent';
      case 'SUPERVISEUR': return 'Superviseur';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'AGENT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SUPERVISEUR':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MAKER':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'UTILISATEUR':
      case 'ADHERENT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-indigo-500';
      case 'AGENT':
        return 'bg-blue-500';
      case 'SUPERVISEUR':
        return 'bg-amber-500';
      case 'MAKER':
        return 'bg-rose-500';
      case 'UTILISATEUR':
      case 'ADHERENT':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-3 h-3" />;
      case 'AGENT':
        return <Briefcase className="w-3 h-3" />;
      case 'SUPERVISEUR':
        return <Shield className="w-3 h-3" />;
      case 'MAKER':
        return <Users className="w-3 h-3" />;
      case 'UTILISATEUR':
      case 'ADHERENT':
        return <UserCheck className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getLeketStatus = (user: any) => {
    if (user.leket?.souscrit) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
          LEKET
        </span>
      );
    }
    return null;
  };

  const getCsuStatus = (user: any) => {
    if (user.csu?.actif) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
          CSU
        </span>
      );
    }
    return null;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.rolePrincipal === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des adhérents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Adhérents</h1>
            <p className="text-sm text-gray-500 mt-1">Gérez et suivez tous les adhérents du système</p>
          </div>
          <button 
            onClick={() => navigate('nouveau')}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            Nouvel Adhérent
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              teal: 'bg-teal-100 text-teal-600',
              indigo: 'bg-indigo-100 text-indigo-600',
              blue: 'bg-blue-100 text-blue-600',
              emerald: 'bg-emerald-100 text-emerald-600',
              rose: 'bg-rose-100 text-rose-600',
              amber: 'bg-amber-100 text-amber-600'
            }[stat.color];

            return (
              <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses} shadow-inner`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value.toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8 shadow-sm overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row gap-4 items-center bg-white">
            {/* Search */}
            <div className="flex-1 w-full relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher un adhérent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-sm"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none appearance-none text-sm font-medium text-gray-700 min-w-[160px]"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="ADMIN">Administrateurs</option>
                  <option value="AGENT">Agents</option>
                  <option value="SUPERVISEUR">Superviseurs</option>
                  <option value="MAKER">Makers</option>
                  <option value="UTILISATEUR">Adhérents</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>

              {/* Items per page */}
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-sm font-medium text-gray-700"
              >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-4">
                    <input type="checkbox" className="rounded-md border-gray-300 text-teal-600 focus:ring-teal-500 w-4 h-4" />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Informations Adhérent
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Localisation & Code
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Services
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Rôles
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-teal-50/30 transition-colors group cursor-pointer" 
                    onClick={() => navigate(`/utilisateur/${user._id}`)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded-md border-gray-300 text-teal-600 focus:ring-teal-500 w-4 h-4" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 ${getAvatarColor(user.rolePrincipal)} rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                          <span className="text-sm">{user.prenom[0]}{user.nom[0]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{user.prenom} {user.nom}</p>
                          <p className="text-xs text-gray-500 font-medium">@{user.username}</p>
                          <p className="text-[10px] text-teal-600 font-bold mt-0.5">{user.codeUtilisateur || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {user.commune || user.departement || 'Non défini'}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.telephone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {getLeketStatus(user)}
                        {getCsuStatus(user)}
                        {!user.leket?.souscrit && !user.csu?.actif && (
                          <span className="text-xs text-gray-400 italic">Aucun</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${getRoleColor(user.rolePrincipal)} shadow-sm`}>
                        {getRoleIcon(user.rolePrincipal)}
                        {getRoleLabel(user.rolePrincipal)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={user.statut === 'actif'} 
                          className="sr-only peer" 
                          onChange={() => handleStatusChange(user._id, user.statut === 'actif' ? 'inactif' : 'actif')}
                        />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                          className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg transition-all"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        
                        {openMenuId === user._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                            <button
                              onClick={() => {
                                navigate(`/utilisateur/${user._id}`);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4" />
                              Voir les détails
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/utilisateur/${user._id}/edit`);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4" />
                              Modifier
                            </button>
                            <button
                              onClick={() => {
                                const newStatus = user.statut === 'actif' ? 'suspendu' : 'actif';
                                handleStatusChange(user._id, newStatus);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              {user.statut === 'actif' ? (
                                <>
                                  <Lock className="w-4 h-4" />
                                  Suspendre
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
                              onClick={() => {
                                handleDelete(user._id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" 
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nouvel Utilisateur */}
      <NouvelUtilisateurModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};
