import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus, MoreVertical, Users, Crown, Briefcase, UserCheck, Banknote, Shield, Edit, Trash2, Eye, Lock, Unlock } from 'lucide-react';
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
        profession: userData.profession,
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
      label: 'Total Utilisateurs', 
      value: statistics?.total || 0, 
      icon: Users, 
      color: 'blue' 
    },
    { 
      label: 'Administrateurs', 
      value: statistics?.byRole['ADMIN'] || 0, 
      icon: Crown, 
      color: 'purple' 
    },
    { 
      label: 'Agents', 
      value: statistics?.byRole['AGENT'] || 0, 
      icon: Briefcase, 
      color: 'orange' 
    },
    { 
      label: 'Adhérents', 
      value: statistics?.byRole['ADHERENT'] || 0, 
      icon: UserCheck, 
      color: 'green' 
    },
    { 
      label: 'Makers', 
      value: statistics?.byRole['MAKER'] || 0, 
      icon: Banknote, 
      color: 'teal' 
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'AGENT':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MAKER':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ADHERENT':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'SUPERVISEUR':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-yellow-400';
      case 'AGENT':
        return 'bg-purple-400';
      case 'MAKER':
        return 'bg-pink-400';
      case 'ADHERENT':
        return 'bg-purple-400';
      case 'SUPERVISEUR':
        return 'bg-cyan-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-3 h-3" />;
      case 'AGENT':
        return <Briefcase className="w-3 h-3" />;
      case 'MAKER':
        return <Users className="w-3 h-3" />;
      case 'ADHERENT':
        return <UserCheck className="w-3 h-3" />;
      case 'SUPERVISEUR':
        return <Shield className="w-3 h-3" />;
      default:
        return null;
    }
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
          <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-sm text-gray-500 mt-1">Gérez et suivez tous les utilisateurs du système</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            Nouvel Utilisateur
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
              green: 'bg-green-100 text-green-600',
              teal: 'bg-teal-100 text-teal-600'
            }[stat.color];

            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Tous les rôles</option>
                <option value="ADMIN">Administrateurs</option>
                <option value="AGENT">Agents</option>
                <option value="MAKER">Makers</option>
                <option value="ADHERENT">Adhérents</option>
                <option value="SUPERVISEUR">Superviseurs</option>
              </select>
            </div>

            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Utilisateur ⇅
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email ⇅
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rôles
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/utilisateur/${user._id}`)}>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getAvatarColor(user.rolePrincipal)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                          <span className="text-sm">{user.prenom[0]}{user.nom[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.prenom} {user.nom}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {user.telephone}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.rolePrincipal)}`}>
                        {getRoleIcon(user.rolePrincipal)}
                        {user.rolePrincipal === 'ADMIN' && 'Admin'}
                        {user.rolePrincipal === 'AGENT' && 'Agent'}
                        {user.rolePrincipal === 'MAKER' && 'Maker'}
                        {user.rolePrincipal === 'ADHERENT' && 'Adhérent'}
                        {user.rolePrincipal === 'SUPERVISEUR' && 'Superviseur'}
                      </span>
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={user.statut === 'actif'} className="sr-only peer" readOnly />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </td>
                    <td className="px-4 py-4 relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      {/* Menu déroulant */}
                      {openMenuId === user._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
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
                        </div>
                      )}
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
