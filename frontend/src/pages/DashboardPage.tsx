import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Wallet, Network, ArrowUpRight, MapPin, 
  TrendingUp, ArrowRight, Activity, Zap, Target, 
  ChevronRight, Info, BarChart3, Globe
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { SENEGAL_GEOGRAPHIC_DATA } from '../data/geoData';
import { POLES_TERRITOIRES_DATA, PoleData } from '../data/polesData';
import SenegalMap from '../components/SenegalMap';
import { userAPI } from '../lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
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
  BarElement,
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

  // État pour la sélection du pôle
  const [selectedPole, setSelectedPole] = useState<PoleData>(POLES_TERRITOIRES_DATA["OUEST"]);

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

  // Données pour le graphique comparatif des pôles
  const polesComparisonData = {
    labels: Object.values(POLES_TERRITOIRES_DATA).map(p => p.nom.replace('Pôle ', '')),
    datasets: [
      {
        label: 'Taux d\'emploi (%)',
        data: Object.values(POLES_TERRITOIRES_DATA).map(p => parseInt(p.tauxEmploi)),
        backgroundColor: Object.values(POLES_TERRITOIRES_DATA).map(p => p.couleur),
        borderRadius: 8,
      }
    ]
  };

  const polesComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: (context: any) => `Taux d'emploi: ${context.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 60,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: '#64748b' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10 } }
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* En-tête Premium */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Vision Sénégal 2050</h1>
                <p className="text-xs text-slate-500 font-medium">Tableau de Bord des Pôles Territoires • ANSD 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-semibold text-slate-700">Actualisé le 28 Jan 2026</span>
                <span className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Système en direct
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes de statistiques Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Utilisateurs', value: stats.utilisateurs, icon: Users, color: 'blue', path: '/utilisateurs' },
            { label: 'Caisses Actives', value: stats.caisses, icon: Wallet, color: 'cyan', path: '/caisses' },
            { label: 'Réseaux', value: stats.reseaux, icon: Network, color: 'purple', path: '/communautes' },
            { label: 'Transactions', value: stats.transactions, icon: TrendingUp, color: 'orange', path: '/transactions' }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => item.path && navigate(item.path)}
              className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${item.color}-50 rounded-full opacity-50 group-hover:scale-110 transition-transform`}></div>
              <div className="relative flex items-center gap-4">
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center group-hover:bg-${item.color}-600 transition-colors`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600 group-hover:text-white transition-colors`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                    <span className="text-[10px] font-bold text-green-600">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Carte et Analyse des Pôles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Carte Interactive */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Cartographie des Pôles Territoires
                </h2>
                <p className="text-sm text-slate-500 mt-1">Cliquez sur un pôle pour analyser ses potentialités</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">VISION 2050</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
              <div className="md:col-span-2">
                <SenegalMap 
                  onPoleSelect={setSelectedPole} 
                  selectedPoleId={selectedPole.id} 
                />
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: selectedPole.couleur }}></div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedPole.nom}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Population</p>
                      <p className="text-lg font-bold text-slate-800">{selectedPole.population}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Taux Emploi</p>
                      <p className="text-lg font-bold text-blue-600">{selectedPole.tauxEmploi}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                      <Zap className="w-3 h-3 text-amber-500" />
                      Points Stratégiques
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPole.pointsForts.map((pt, i) => (
                        <span key={i} className="px-2 py-1 bg-white text-slate-700 rounded-md text-[10px] font-medium border border-slate-100 shadow-sm">
                          {pt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Régions couvertes</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPole.regions.map((reg, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analyse des Potentiels */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-900">Potentialités du Pôle</h3>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {selectedPole.potentiels.map((pot, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 group">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:bg-amber-500 transition-colors">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">{i + 1}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed flex-1">{pot}</p>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group">
              Détails du Pôle
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Graphiques Dynamiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Comparatif Emploi par Pôle */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Taux d'Emploi par Pôle</h3>
                  <p className="text-xs text-slate-500">Statistiques ANSD 2025</p>
                </div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={polesComparisonData} options={polesComparisonOptions} />
            </div>
          </div>

          {/* Évolution Transactions Premium */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Activité des Transactions</h3>
                  <p className="text-xs text-slate-500">Volume mensuel consolidé</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold">
                +4.5% CE MOIS
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={transactionsData} options={transactionsOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
