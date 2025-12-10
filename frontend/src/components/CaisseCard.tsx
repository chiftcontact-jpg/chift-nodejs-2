import React from 'react';
import { Users, Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from './Badge';

interface CaisseCardProps {
  id: string;
  nom: string;
  numero: string;
  statut: 'Active' | 'Inactive' | 'Diambal';
  type?: 'Avec' | 'Madial';
  totalMembres: number;
  femmes: number;
  hommes: number;
  frequence: string;
  jour: string;
  echeance?: string;
  region: string;
  departement: string;
  commune: string;
  makers?: Array<{ nom: string }>;
  onView: () => void;
}

export const CaisseCard: React.FC<CaisseCardProps> = ({
  nom,
  numero,
  statut,
  type,
  totalMembres,
  femmes,
  hommes,
  frequence,
  jour,
  echeance,
  region,
  departement,
  commune,
  makers = [],
  onView,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">{nom}</h3>
            <p className="text-primary-100 text-sm">{numero}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={statut === 'Active' ? 'success' : statut === 'Inactive' ? 'danger' : 'warning'}>
              {statut}
            </Badge>
            {type && <Badge variant="info">{type}</Badge>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Users className="w-5 h-5 text-primary-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{totalMembres}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">{femmes}</div>
            <div className="text-xs text-gray-600">Femmes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{hommes}</div>
            <div className="text-xs text-gray-600">Hommes</div>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="px-6 py-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-green-600 mr-2" />
          <span className="font-medium text-gray-700">{region}</span>
          <span className="mx-1">•</span>
          <span className="font-medium text-gray-700">{departement}</span>
          <span className="mx-1">•</span>
          <span className="font-medium text-gray-700">{commune}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 text-primary-600 mr-2" />
          <span className="text-gray-700">
            <span className="font-medium">Fréquence:</span> {frequence}
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 text-primary-600 mr-2" />
          <span className="text-gray-700">
            <span className="font-medium">Jour:</span> {jour}
          </span>
        </div>

        {echeance && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Échéance:</span> {echeance}
          </div>
        )}

        {/* Makers */}
        {makers.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Makers</p>
            {makers.map((maker, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <Users className="w-3 h-3 text-gray-400 mr-2" />
                {maker.nom}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50">
        <button
          onClick={onView}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4" />
          Voir les caisses
        </button>
      </div>
    </div>
  );
};
