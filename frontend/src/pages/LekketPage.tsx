import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Users, 
  Calendar,
  MapPin,
  Building2,
  User,
  Edit,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateCaisseLekketModal, CaisseLekketFormData } from '../components/CreateCaisseLekketModal';
import { caisseAPI, agentAPI } from '../lib/api';

interface Caisse {
  id: string;
  nom: string;
  numero: string;
  statut: 'active' | 'inactive';
  badge: 'Djambal' | 'Madial' | 'Avec';
  totalMembres: number;
  femmes: number;
  hommes: number;
  frequence: string;
  jour: string;
  makers: Array<{ nom: string; id: string }>;
}

interface Reseau {
  id: string;
  nom: string;
  statut: 'active' | 'inactive';
  nombreCaisses: number;
  dateCreation: string;
  president: string;
}

interface Localisation {
  region: string;
  departement: string;
  commune: string;
}

export const LekketPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'caisses' | 'reseaux'>('caisses');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localisation] = useState<Localisation>({
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Ouakam'
  });

  const [caisses, setCaisses] = useState<Caisse[]>([
    {
      id: '1',
      nom: 'SOLIDARITE',
      numero: '#100-101-OUAKAM-0002',
      statut: 'inactive',
      badge: 'Djambal',
      totalMembres: 30,
      femmes: 10,
      hommes: 20,
      frequence: 'Hebdomadaire',
      jour: 'Lundi',
      makers: [{ nom: 'Mamadou Diop', id: '1' }]
    },
    {
      id: '2',
      nom: 'SENEGAAL SOLIDARITE',
      numero: '#100-101-OUAKAM-0003',
      statut: 'active',
      badge: 'Avec',
      totalMembres: 20,
      femmes: 10,
      hommes: 10,
      frequence: 'Hebdomadaire',
      jour: 'Mardi',
      makers: []
    },
    {
      id: '3',
      nom: 'MADIAL',
      numero: '#100-101-OUAKAM-0004',
      statut: 'active',
      badge: 'Madial',
      totalMembres: 20,
      femmes: 10,
      hommes: 10,
      frequence: 'Hebdomadaire',
      jour: 'Lundi',
      makers: []
    }
  ]);

  const [reseaux] = useState<Reseau[]>([
    {
      id: '1',
      nom: 'PENCOUM DAKAARU',
      statut: 'active',
      nombreCaisses: 3,
      dateCreation: '01/07/2025',
      president: 'Astou Sarr'
    }
  ]);

  const getStatutBadgeColor = (statut: string) => {
    return statut === 'active' 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-red-100 text-red-700 border-red-200';
  };

  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'Djambal':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Madial':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Avec':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredCaisses = caisses.filter(caisse => 
    caisse.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caisse.numero.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReseaux = reseaux.filter(reseau =>
    reseau.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCaisse = async (data: CaisseLekketFormData) => {
    try {
      let agentId = data.agentId;

      // Si on crée un nouvel agent
      if (data.agentOption === 'new' && data.newAgent) {
        if (!data.newAgent.nom || !data.newAgent.prenom || !data.newAgent.telephone || !data.newAgent.email) {
          alert('Veuillez remplir tous les champs obligatoires de l\'agent');
          return;
        }

        const agentResponse = await agentAPI.create(data.newAgent);
        if (agentResponse?.data?.success) {
          agentId = agentResponse.data.data._id;
          console.log('✅ Agent créé avec ID:', agentId);
        } else {
          throw new Error('Échec de la création de l\'agent');
        }
      }

      const response = await caisseAPI.create({
        nom: data.nom,
        communaute: '', // À définir selon votre logique
        badge: data.modeleUtilise,
        frequence: data.frequence,
        jour: data.jour,
        montantCotisation: 0,
        region: data.region,
        departement: data.departement,
        commune: data.commune,
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
        
        const newCaisse: Caisse = {
          id: apiCaisse._id,
          nom: apiCaisse.nom,
          numero: apiCaisse.numero,
          statut: apiCaisse.statut,
          badge: apiCaisse.badge,
          totalMembres: apiCaisse.totalMembres,
          femmes: apiCaisse.femmes,
          hommes: apiCaisse.hommes,
          frequence: apiCaisse.frequence,
          jour: apiCaisse.jour,
          makers: apiCaisse.makers || []
        };

        // Affecter l'agent à la caisse si un agent est sélectionné/créé
        if (agentId) {
          try {
            await caisseAPI.addMaker(apiCaisse._id, agentId);
            alert(`✅ Caisse créée avec succès!\n✅ Agent affecté à la caisse`);
          } catch (error) {
            console.error('Erreur lors de l\'affectation de l\'agent:', error);
            alert(`✅ Caisse créée avec succès!\n⚠️ Erreur lors de l'affectation de l'agent`);
          }
        } else {
          alert('Caisse créée avec succès !');
        }

        setCaisses(prev => [...prev, newCaisse]);
      }
    } catch (error: any) {
      console.error('Erreur lors de la création de la caisse:', error);
      const message = error.response?.data?.message || 'Erreur lors de la création de la caisse';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête avec localisation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Région */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Région</p>
                <p className="text-lg font-semibold text-gray-900">{localisation.region}</p>
              </div>
            </div>

            {/* Département */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Département</p>
                <p className="text-lg font-semibold text-gray-900">{localisation.departement}</p>
              </div>
            </div>

            {/* Commune */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Commune</p>
                <p className="text-lg font-semibold text-gray-900">{localisation.commune}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('caisses')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'caisses'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Caisses
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'caisses' ? 'bg-gray-300' : 'bg-gray-200'
              }`}>
                {caisses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reseaux')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'reseaux'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Users className="w-5 h-5" />
              Réseaux
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'reseaux' ? 'bg-teal-700' : 'bg-gray-200'
              }`}>
                {reseaux.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Barre de recherche et bouton créer */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'caisses' ? 'Rechercher une caisse...' : 'Rechercher un réseau...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <button 
            onClick={() => activeTab === 'caisses' && setIsCreateModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ml-4"
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'caisses' ? 'Créer une caisse' : 'Créer un réseau'}
          </button>
        </div>

        {/* Contenu conditionnel selon l'onglet actif */}
        {activeTab === 'caisses' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCaisses.map((caisse) => (
                <div
                  key={caisse.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/caisse/${caisse.id}`)}
                >
                  {/* En-tête de la carte */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{caisse.nom}</h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatutBadgeColor(caisse.statut)}`}>
                          {caisse.statut === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getBadgeColor(caisse.badge)}`}>
                          {caisse.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{caisse.numero}</p>
                  </div>

                  {/* Statistiques membres */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{caisse.totalMembres}</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <User className="w-5 h-5 text-pink-500" />
                        </div>
                        <p className="text-2xl font-bold text-pink-600">{caisse.femmes}</p>
                        <p className="text-xs text-gray-500">Femmes</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{caisse.hommes}</p>
                        <p className="text-xs text-gray-500">Hommes</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="p-6 border-b border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Fréquence:</span>
                      <span>{caisse.frequence}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Jour:</span>
                      <span>{caisse.jour}</span>
                    </div>
                  </div>

                  {/* Section Makers */}
                  <div className="p-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Makers</p>
                    {caisse.makers.length > 0 ? (
                      <div className="space-y-2">
                        {caisse.makers.map((maker) => (
                          <div key={maker.id} className="flex items-center gap-2">
                            <User className="w-4 h-4 text-teal-600" />
                            <span className="text-sm text-gray-600">{maker.nom}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Aucun maker assigné</p>
                    )}

                    <button className={`w-full mt-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      caisse.makers.length > 0
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}>
                      <Users className="w-4 h-4 inline mr-2" />
                      Ajouter un maker
                    </button>
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
        ) : (
          <div className="space-y-4">
            {filteredReseaux.map((reseau) => (
              <div
                key={reseau.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Informations du réseau */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{reseau.nom}</h3>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <span className={`px-3 py-1 rounded text-sm font-medium border ${
                        reseau.statut === 'active'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {reseau.statut === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-semibold">{reseau.nombreCaisses}</span> caisses
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Création:</span> {reseau.dateCreation}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-medium">Président(e):</span> {reseau.president}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                        <Users className="w-4 h-4" />
                        Président(e)
                      </button>

                      <button 
                        onClick={() => navigate(`/reseau/${reseau.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredReseaux.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucun réseau trouvé</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de création de caisse */}
      <CreateCaisseLekketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCaisse}
      />
    </div>
  );
};
