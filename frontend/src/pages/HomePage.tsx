import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Building2, Users, Calendar } from 'lucide-react';

interface Communaute {
  id: string;
  nom: string;
  region: string;
  departement: string;
  commune: string;
  nombreCaisses: number;
}

interface Caisse {
  id: string;
  nom: string;
  numero: string;
  communaute: string;
  totalMembres: number;
  femmes: number;
  hommes: number;
  frequence: string;
  jour: string;
  region: string;
  departement: string;
  commune: string;
}

const mockCommunautes: Communaute[] = [
  {
    id: '1',
    nom: 'Gorée',
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Gorée',
    nombreCaisses: 1,
  },
  {
    id: '2',
    nom: 'Ouakam',
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Ouakam',
    nombreCaisses: 1,
  },
  {
    id: '3',
    nom: 'Dalifort',
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Pikine',
    nombreCaisses: 1,
  },
];

const mockCaisses: Caisse[] = [
  {
    id: '1',
    nom: 'MBOOTAY GUI',
    numero: '100-101-OUAKAM-0001',
    communaute: 'Ouakam',
    totalMembres: 15,
    femmes: 10,
    hommes: 5,
    frequence: 'Hebdomadaire',
    jour: 'Lundi',
    region: 'Dakar',
    departement: 'Dakar',
    commune: 'Ouakam',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mes-caisses' | 'supervisees'>('supervisees');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 pt-6">
            <button
              onClick={() => setActiveTab('mes-caisses')}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-t-lg font-medium transition-all ${
                activeTab === 'mes-caisses'
                  ? 'bg-gray-100 text-gray-700 border-b-2 border-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Mes Caisses (1)
            </button>
            <button
              onClick={() => setActiveTab('supervisees')}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-t-lg font-medium transition-all ${
                activeTab === 'supervisees'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Caisses Supervisées (3)
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add button */}
        <div className="flex justify-end mb-6">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Ajouter une caisse
          </button>
        </div>

        {activeTab === 'supervisees' ? (
          /* Grid des communautés */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCommunautes.map((communaute) => (
              <div
                key={communaute.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => navigate(`/communaute/${communaute.id}/caisses`)}
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-primary-600 flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    {communaute.nom}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                      {communaute.commune}, {communaute.departement}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {communaute.nombreCaisses} caisse{communaute.nombreCaisses > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="px-6 py-4 bg-gray-50">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Voir les caisses
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Liste Ma Caisse */
          <div className="grid grid-cols-1 gap-6">
            {mockCaisses.map((caisse) => (
              <div
                key={caisse.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl">{caisse.nom}</h3>
                      <p className="text-primary-100 text-sm mt-1">{caisse.numero}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Stats */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Users className="w-8 h-8 text-primary-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{caisse.totalMembres}</div>
                        <div className="text-sm text-gray-600">Membres</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                      <Users className="w-8 h-8 text-pink-600" />
                      <div>
                        <div className="text-2xl font-bold text-pink-600">{caisse.femmes}</div>
                        <div className="text-sm text-gray-600">Femmes</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{caisse.hommes}</div>
                        <div className="text-sm text-gray-600">Hommes</div>
                      </div>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      <span>{caisse.region} - {caisse.departement} - {caisse.commune}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-primary-600" />
                      <span>Fréquence: {caisse.frequence} - {caisse.jour}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/caisse/${caisse.id}`)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                      Voir les détails
                    </button>
                    <button
                      onClick={() => navigate(`/caisse/${caisse.id}/membres`)}
                      className="flex-1 bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                      Voir les membres
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
