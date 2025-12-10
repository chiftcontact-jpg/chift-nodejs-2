import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  MapPin,
  Building2,
  Eye,
  Plus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Communaute {
  id: string;
  nom: string;
  commune: string;
  region: string;
  departement: string;
  nombreCaisses: number;
}

export const ReseauDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [reseau, setReseau] = useState<any>(null);

  useEffect(() => {
    // Mock data - À remplacer par un appel API
    setReseau({
      id: id,
      nom: 'PENCOUM DAKAARU',
      statut: 'active',
      nombreCaisses: 3,
      dateCreation: '01/07/2025',
      president: 'Astou Sarr'
    });
  }, [id]);

  const [communautes] = useState<Communaute[]>([
    {
      id: '1',
      nom: 'Ouakam',
      commune: 'Ouakam',
      region: 'Dakar',
      departement: 'Dakar',
      nombreCaisses: 1
    },
    {
      id: '2',
      nom: 'Dalifort',
      commune: 'Pikine',
      region: 'Dakar',
      departement: 'Dakar',
      nombreCaisses: 1
    },
    {
      id: '3',
      nom: 'Gorée',
      commune: 'Gorée',
      region: 'Dakar',
      departement: 'Dakar',
      nombreCaisses: 1
    }
  ]);

  if (!reseau) {
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
            onClick={() => navigate('/leket')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour à l'accueil</span>
          </button>

          {/* Titre de la page */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Communautés de l'association
              </h1>
              <p className="text-gray-500">
                {communautes.length} communes avec des caisses
              </p>
            </div>

            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              Ajouter une caisse
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communautes.map((communaute) => (
            <div
              key={communaute.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* En-tête de la carte */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {communaute.nom}
                    </h3>
                  </div>
                </div>

                {/* Informations de localisation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{communaute.region}, {communaute.departement}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>
                      <span className="font-semibold">{communaute.nombreCaisses}</span> caisse{communaute.nombreCaisses > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bouton d'action */}
              <div className="p-6">
                <button
                  onClick={() => navigate(`/communaute/${communaute.id}/caisses`)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Voir les caisses
                </button>
              </div>
            </div>
          ))}
        </div>

        {communautes.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune communauté trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};
