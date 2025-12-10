import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Search,
  Users,
  User,
  Building2,
  Calendar,
  UserPlus,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateCaisseModal, CaisseFormData } from '../components/CreateCaisseModal';
import { caisseAPI } from '../lib/api';

interface Caisse {
  id: string;
  nom: string;
  numero: string;
  statut: 'active' | 'inactive';
  badge: 'Avec';
  commune: string;
  region: string;
  departement: string;
  totalMembres: number;
  femmes: number;
  hommes: number;
  frequence: string;
  jour: string;
  echeance: {
    evenement: string;
    date: string;
  };
  maker: {
    nom: string;
    email: string;
  } | null;
}

export const CommunauteCaissesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [caisses, setCaisses] = useState<Caisse[]>([]);
  const [communaute, setCommunaute] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  useEffect(() => {
    // Mock data - À remplacer par un appel API
    setCommunaute({
      id: id,
      nom: 'Ouakam',
      region: 'Dakar',
      departement: 'Dakar'
    });

    setCaisses([
      {
        id: '1',
        nom: 'MBOOTAY GUI',
        numero: '100-101-OUAKAM-0001',
        statut: 'active',
        badge: 'Avec',
        commune: 'Ouakam',
        region: 'Dakar',
        departement: 'Dakar',
        totalMembres: 15,
        femmes: 10,
        hommes: 5,
        frequence: 'Hebdomadaire',
        jour: 'Lundi',
        echeance: {
          evenement: 'Korité',
          date: '03/08/2025'
        },
        maker: {
          nom: 'Fatou Ndiaye',
          email: 'fatou@chift.com'
        }
      }
    ]);
  }, [id]);

  const filteredCaisses = caisses.filter(caisse =>
    caisse.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caisse.numero.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCaisse = async (data: CaisseFormData) => {
    try {
      const response = await caisseAPI.create({
        nom: data.nom,
        communaute: id || '',
        badge: data.modeleUtilise,
        frequence: data.frequence,
        jour: data.jour,
        montantCotisation: 0, // À définir selon votre logique
        region: communaute.region,
        departement: communaute.departement,
        commune: communaute.nom,
        dateCreationPhysique: data.dateCreationPhysique,
        femmesActives: data.femmesActives,
        hommesActifs: data.hommesActifs,
        echeanceEvenement: data.echeanceEvenement,
        dateEcheance: data.dateEcheance,
        solidarite: data.solidarite,
        tauxInteret: data.tauxInteret
      });

      if (response.data.success) {
        const apiCaisse = response.data.data;
        
        // Transformer les données API vers le format local
        const newCaisse: Caisse = {
          id: apiCaisse._id,
          nom: apiCaisse.nom,
          numero: apiCaisse.numero,
          statut: apiCaisse.statut,
          badge: apiCaisse.badge,
          commune: apiCaisse.commune,
          region: apiCaisse.region,
          departement: apiCaisse.departement,
          totalMembres: apiCaisse.totalMembres,
          femmes: apiCaisse.femmes,
          hommes: apiCaisse.hommes,
          frequence: apiCaisse.frequence,
          jour: apiCaisse.jour,
          echeance: {
            evenement: data.echeanceEvenement || 'À définir',
            date: data.dateEcheance
          },
          maker: apiCaisse.makers && apiCaisse.makers.length > 0 
            ? { nom: apiCaisse.makers[0].nom, email: '' }
            : null
        };

        setCaisses(prev => [...prev, newCaisse]);
        alert('Caisse créée avec succès !');
      }
    } catch (error: any) {
      console.error('Erreur lors de la création de la caisse:', error);
      const message = error.response?.data?.message || 'Erreur lors de la création de la caisse';
      alert(message);
    }
  };

  const handleDeleteCaisse = async (caisseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette caisse ?')) return;
    
    try {
      await caisseAPI.delete(caisseId);
      setCaisses(prev => prev.filter(c => c.id !== caisseId));
      alert('Caisse supprimée avec succès !');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression de la caisse');
    }
  };

  const handleStatusChange = async (caisseId: string, newStatus: 'active' | 'inactive') => {
    try {
      await caisseAPI.changeStatus(caisseId, newStatus);
      setCaisses(prev => prev.map(c => 
        c.id === caisseId ? { ...c, statut: newStatus } : c
      ));
      alert(`Caisse ${newStatus === 'active' ? 'activée' : 'désactivée'} avec succès !`);
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const getStatutBadgeColor = (statut: string) => {
    return statut === 'active' 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-red-100 text-red-700 border-red-200';
  };

  if (!communaute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Bouton retour */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </button>

          {/* Barre de recherche et bouton créer */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une caisse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500 whitespace-nowrap">{filteredCaisses.length} résultat{filteredCaisses.length > 1 ? 's' : ''}</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Créer une caisse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          {filteredCaisses.map((caisse) => (
            <div
              key={caisse.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/caisse/${caisse.id}`)}
            >
              <div className="p-6">
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{caisse.nom}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatutBadgeColor(caisse.statut)}`}>
                          {caisse.statut === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-3 py-1 rounded text-xs font-medium border bg-cyan-100 text-cyan-700 border-cyan-200">
                          {caisse.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{caisse.numero}</p>
                    
                    {/* Localisation */}
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{caisse.commune}</span>
                      <span className="text-gray-400">•</span>
                      <span>{caisse.region}, {caisse.departement}</span>
                    </div>
                  </div>
                  
                  {/* Menu actions */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === caisse.id ? null : caisse.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {openMenuId === caisse.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/caisse/${caisse.id}`);
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
                              navigate(`/caisse/${caisse.id}/edit`);
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
                              handleStatusChange(caisse.id, newStatus);
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
                              handleDeleteCaisse(caisse.id);
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

                {/* Statistiques membres */}
                <div className="grid grid-cols-3 gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{caisse.totalMembres}</p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <User className="w-6 h-6 text-pink-500" />
                    </div>
                    <p className="text-3xl font-bold text-pink-600">{caisse.femmes}</p>
                    <p className="text-sm text-gray-500">Femmes</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <User className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{caisse.hommes}</p>
                    <p className="text-sm text-gray-500">Hommes</p>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span className="font-medium">Fréquence:</span>
                    <span>{caisse.frequence}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span className="font-medium">Jour:</span>
                    <span>{caisse.jour}</span>
                  </div>
                </div>

                {/* Échéance */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Échéance: {caisse.echeance.evenement}</p>
                  <p className="text-sm font-medium text-gray-700">({caisse.echeance.date})</p>
                </div>

                {/* Maker */}
                <div className="border-t border-gray-200 pt-6">
                  {caisse.maker ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-teal-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{caisse.maker.nom}</p>
                          <p className="text-xs text-gray-500">({caisse.maker.email})</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Aucun maker assigné</p>
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Action pour créer un maker
                    }}
                    className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Créer Maker
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCaisses.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune caisse trouvée</p>
          </div>
        )}
      </div>

      {/* Modal de création */}
      {communaute && (
        <CreateCaisseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCaisse}
          communauteInfo={{
            id: communaute.id,
            nom: communaute.nom,
            region: communaute.region,
            departement: communaute.departement
          }}
        />
      )}
    </div>
  );
};
