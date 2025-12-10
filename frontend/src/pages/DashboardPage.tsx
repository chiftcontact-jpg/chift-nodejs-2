import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Wallet, Network, ArrowUpRight, MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { SENEGAL_GEOGRAPHIC_DATA } from '../data/geoData';
import { userAPI } from '../lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  utilisateurs: number;
  caisses: number;
  reseaux: number;
  transactions: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats>({
    utilisateurs: 0,
    caisses: 8,
    reseaux: 3,
    transactions: 1
  });
  
  const [loadingStats, setLoadingStats] = useState(true);

  const [caissesStats] = useState({
    actives: 7,
    inactives: 1
  });

  // État pour la sélection de région
  const [selectedRegion, setSelectedRegion] = useState('DAKAR');
  const [regionStats] = useState({
    DAKAR: {
      nom: 'Dakar',
      nombreCaisses: 7,
      contributions: '4.1K FCFA',
      progression: 1.4,
      objectif: 500
    }
  });

  // Données pour le graphique d'évolution des transactions
  const transactionsData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Transactions',
        data: [0, 0, 0, 0, 0, 0.002, 0.0045, 0, 0, 0],
        fill: true,
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderColor: 'rgb(6, 182, 212)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(6, 182, 212)',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2
      }
    ]
  };

  const transactionsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          },
          callback: function(value: any) {
            return value.toFixed(5) + 'M';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  // Données pour le graphique en donut
  const caissesData = {
    labels: ['Actives', 'Inactives'],
    datasets: [
      {
        data: [caissesStats.actives, caissesStats.inactives],
        backgroundColor: ['#0E7490', '#3B82F6'],
        borderWidth: 0,
        cutout: '75%'
      }
    ]
  };

  const caissesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoadingStats(true);
      const response = await userAPI.getStatistics();
      
      if (response.data.success) {
        const userStats = response.data.data;
        setStats(prev => ({
          ...prev,
          utilisateurs: userStats.total || 0
        }));
      }
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
              <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre plateforme de gestion</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                En ligne
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Utilisateurs */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/utilisateurs')}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Utilisateurs</p>
                  {loadingStats ? (
                    <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">{stats.utilisateurs}</p>
                  )}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Caisses */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Caisses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.caisses}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Réseaux */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Network className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Réseaux</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.reseaux}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transactions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.transactions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution des transactions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Évolution des transactions</h3>
                <p className="text-sm text-gray-500 mt-1">Suivi mensuel des transactions</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={transactionsData} options={transactionsOptions} />
            </div>
          </div>

          {/* Répartition des caisses */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Répartition des caisses</h3>
                <p className="text-sm text-gray-500 mt-1">Statut actuel des caisses</p>
              </div>
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-center" style={{ height: '250px' }}>
              <div style={{ width: '250px', height: '250px' }}>
                <Doughnut data={caissesData} options={caissesOptions} />
              </div>
            </div>

            {/* Légende */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#0E7490] rounded-full"></span>
                  <span className="text-sm font-medium text-gray-700">Actives</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{caissesStats.actives}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#3B82F6] rounded-full"></span>
                  <span className="text-sm font-medium text-gray-700">Inactives</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{caissesStats.inactives}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Répartition des caisses par région */}
        <div className="mt-8 bg-white rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Répartition des caisses par région</h2>
              <p className="text-sm text-gray-500 mt-1">Analyse géographique des caisses</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>

          {/* Sélecteur de région */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner une région
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
            >
              {Object.keys(SENEGAL_GEOGRAPHIC_DATA).map((regionKey) => (
                <option key={regionKey} value={regionKey}>
                  {SENEGAL_GEOGRAPHIC_DATA[regionKey as keyof typeof SENEGAL_GEOGRAPHIC_DATA].nom}
                </option>
              ))}
            </select>
          </div>

          {/* Détails de la région sélectionnée */}
          {regionStats[selectedRegion as keyof typeof regionStats] && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {regionStats[selectedRegion as keyof typeof regionStats].nom}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Informations détaillées de la région</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-teal-600">
                    {regionStats[selectedRegion as keyof typeof regionStats].nombreCaisses}
                  </p>
                  <p className="text-sm text-gray-500">caisses</p>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total des contributions */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-gray-900">Total des contributions</h4>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {regionStats[selectedRegion as keyof typeof regionStats].contributions}
                  </p>
                </div>

                {/* Progression */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-gray-900">Progression</h4>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progression</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {regionStats[selectedRegion as keyof typeof regionStats].progression}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${regionStats[selectedRegion as keyof typeof regionStats].progression}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Objectif: {regionStats[selectedRegion as keyof typeof regionStats].objectif} caisses
                  </p>
                </div>
              </div>

              {/* Bouton Voir les départements */}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => navigate(`/region/${selectedRegion}/departements`)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Voir les départements
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage
