import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Wallet, ArrowRight } from 'lucide-react';
import { SENEGAL_GEOGRAPHIC_DATA, getDepartements } from '../data/geography';

interface DepartementStats {
  nom: string;
  nombreCaisses: number;
  total: string;
}

export const RegionDepartementsPage: React.FC = () => {
  const { regionId } = useParams<{ regionId: string }>();
  const navigate = useNavigate();
  const [region, setRegion] = useState<any>(null);
  const [departements, setDepartements] = useState<DepartementStats[]>([]);

  useEffect(() => {
    if (regionId && SENEGAL_GEOGRAPHIC_DATA[regionId as keyof typeof SENEGAL_GEOGRAPHIC_DATA]) {
      const regionData = SENEGAL_GEOGRAPHIC_DATA[regionId as keyof typeof SENEGAL_GEOGRAPHIC_DATA];
      setRegion(regionData);

      // Récupérer les départements via l'utilitaire geography
      const depts = getDepartements(regionId);
      
      const deptStats: DepartementStats[] = depts.map((dept) => {
        // Données mock basées sur l'image
        const mockData: Record<string, { nombreCaisses: number; total: string }> = {
          'DAKAR': { nombreCaisses: 6, total: '4.1K FCFA' },
          'PIKINE': { nombreCaisses: 1, total: '0 FCFA' },
          'GUEDIAWAYE': { nombreCaisses: 0, total: '0 FCFA' },
          'RUFISQUE': { nombreCaisses: 0, total: '0 FCFA' },
          'KEUR_MASSAR': { nombreCaisses: 0, total: '0 FCFA' }
        };

        return {
          nom: dept.nom,
          nombreCaisses: mockData[dept.code]?.nombreCaisses || 0,
          total: mockData[dept.code]?.total || '0 FCFA'
        };
      });

      setDepartements(deptStats);
    }
  }, [regionId]);

  if (!region) {
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
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour au tableau de bord</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{region.nom}</h1>
              <p className="text-sm text-gray-500 mt-1">Départements de la région</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid des départements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departements.map((dept, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* En-tête de la carte */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{dept.nom}</h3>
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-teal-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Département</p>
              </div>

              {/* Statistiques */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Nombre de caisses */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Caisses</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{dept.nombreCaisses}</p>
                  </div>

                  {/* Total */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-500">Total</span>
                    </div>
                    <p className="text-lg font-bold text-teal-600">{dept.total}</p>
                  </div>
                </div>

                {/* Bouton Voir les communes */}
                <button
                  onClick={() => navigate(`/region/${regionId}/departement/${dept.nom.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  Voir les communes
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun département */}
        {departements.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun département trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};
