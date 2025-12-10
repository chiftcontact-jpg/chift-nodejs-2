import React, { useState } from 'react';
import { Users, Settings, Plus, MoreVertical, ToggleLeft, ToggleRight } from 'lucide-react';

interface Compte {
  id: string;
  nom: string;
  statut: 'actif' | 'inactif';
  dateCreation: string;
}

interface Service {
  id: string;
  nom: string;
  statut: 'actif' | 'inactif';
  dateCreation: string;
}

export const ComptesServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comptes' | 'services'>('comptes');
  const [comptes, setComptes] = useState<Compte[]>([
    { id: '1', nom: 'LEKET', statut: 'actif', dateCreation: '01/07/2025 15:16' },
    { id: '2', nom: 'NATT', statut: 'inactif', dateCreation: '01/07/2025 15:17' },
    { id: '3', nom: 'CONDAMNE', statut: 'inactif', dateCreation: '01/07/2025 15:17' }
  ]);

  const [services] = useState<Service[]>([
    { id: '1', nom: 'Service Medical', statut: 'actif', dateCreation: '01/07/2025 15:20' },
    { id: '2', nom: 'Service Educatif', statut: 'actif', dateCreation: '01/07/2025 15:21' }
  ]);

  const toggleStatutCompte = (id: string) => {
    setComptes(comptes.map(c => 
      c.id === id 
        ? { ...c, statut: c.statut === 'actif' ? 'inactif' as const : 'actif' as const }
        : c
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back, admin@chift.com 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">admin@chift.com</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">A</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre de comptes */}
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

          {/* Nombre de services */}
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
        {activeTab === 'comptes' && (
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Comptes</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
                Nouveau compte
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      COMPTE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      STATUT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      CRÉATION
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {comptes.map((compte) => (
                    <tr key={compte.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{compte.nom}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatutCompte(compte.id)}
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
                        {compte.dateCreation}
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

        {activeTab === 'services' && (
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Services</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
                Nouveau service
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      SERVICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      STATUT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      CRÉATION
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50 transition-colors">
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
                        {service.dateCreation}
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
      </div>
    </div>
  );
};
