import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Badge } from '../components/Badge';
import { AjouterMembreModal, MembreFormData } from '../components/AjouterMembreModal';

interface Membre {
  id: string;
  prenom: string;
  nom: string;
  telephone: string;
  contribution: number;
  nombreParts: number;
  statut: 'Actif' | 'Inactif';
}

const mockMembres: Membre[] = [
  {
    id: '1',
    prenom: 'FATOU',
    nom: 'NDIAYE',
    telephone: '771234560',
    contribution: 2000,
    nombreParts: 2,
    statut: 'Actif',
  },
  {
    id: '2',
    prenom: 'ASTOU',
    nom: 'SARR',
    telephone: '771239834',
    contribution: 1500,
    nombreParts: 2,
    statut: 'Actif',
  },
  {
    id: '3',
    prenom: 'AMY',
    nom: 'FALL',
    telephone: '751112233',
    contribution: 1500,
    nombreParts: 1,
    statut: 'Actif',
  },
];

export const MembresCaissePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [membres, setMembres] = useState(mockMembres);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStatut = (id: string) => {
    setMembres(membres.map(m =>
      m.id === id
        ? { ...m, statut: m.statut === 'Actif' ? 'Inactif' as const : 'Actif' as const }
        : m
    ));
  };

  const handleAjouterMembre = (data: MembreFormData) => {
    const nouveauMembre: Membre = {
      id: (membres.length + 1).toString(),
      prenom: data.prenom,
      nom: data.nom,
      telephone: data.telephone,
      contribution: data.contribution,
      nombreParts: data.nombreParts,
      statut: 'Actif',
    };
    setMembres([...membres, nouveauMembre]);
  };

  const filteredMembres = membres.filter(membre =>
    `${membre.prenom} ${membre.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    membre.telephone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter un membre
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Search bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {searchQuery && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {filteredMembres.length} résultat{filteredMembres.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">PRÉNOM</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NOM</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">TÉLÉPHONE</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">CONTRIBUTION</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NOMBRE DE PARTS</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">STATUT</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredMembres.map((membre) => (
                  <tr key={membre.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{membre.prenom}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{membre.nom}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{membre.telephone}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {membre.contribution.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{membre.nombreParts}</td>
                    <td className="px-6 py-4">
                      <Badge variant={membre.statut === 'Actif' ? 'success' : 'secondary'}>
                        {membre.statut}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-primary-600 hover:text-primary-700 transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleStatut(membre.id)}
                          className={`transition-colors ${
                            membre.statut === 'Actif'
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {membre.statut === 'Actif' ? (
                            <ToggleRight className="w-6 h-6" />
                          ) : (
                            <ToggleLeft className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filteredMembres.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun membre trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Ajouter un membre */}
      <AjouterMembreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAjouterMembre}
      />
    </div>
  );
};
