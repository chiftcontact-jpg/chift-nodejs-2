import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Droplet,
  CreditCard,
  Users,
  Wallet,
  Gift,
  Stethoscope,
  Building2,
  FileText,
  ArrowRight
} from 'lucide-react';

interface Agent {
  id: string;
  nom: string;
  prenom: string;
  numeroAgent: string;
  telephone: string;
  email: string;
  adresse: string;
  dateNaissance: string;
  groupeSanguin: string;
  numeroNonRenseigne?: string;
  dateAdhesion: string;
  lieuAdhesion: string;
}

interface Service {
  id: string;
  nom: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  active: boolean;
}

export const ProfilAgentPage: React.FC = () => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    // Mock data - À remplacer par un appel API
    setAgent({
      id: '1',
      nom: 'MBAYE',
      prenom: 'ABDOULAYE',
      numeroAgent: '1234567890',
      telephone: '771234561',
      email: 'mbaye@chift.com',
      adresse: 'Grand Mbao',
      dateNaissance: '1948-07-08',
      groupeSanguin: 'O+',
      numeroNonRenseigne: 'N° Non renseigné',
      dateAdhesion: '01/07/2025',
      lieuAdhesion: 'Dakar - Grand Mbao'
    });
  }, []);

  const comptesServices: Service[] = [
    {
      id: 'leket',
      nom: 'LEKET',
      icon: <Wallet className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      active: false
    },
    {
      id: 'sokhla',
      nom: 'SOKHLA',
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      active: false
    },
    {
      id: 'natt',
      nom: 'NATT',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      active: true
    },
    {
      id: 'condamne',
      nom: 'CONDAMNE',
      icon: <Gift className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      active: true
    },
    {
      id: 'leeb',
      nom: 'LEEB',
      icon: <Building2 className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      active: true
    }
  ];

  const servicesCSU = [
    {
      id: 'medecin',
      nom: 'Trouver un médecin',
      icon: <Stethoscope className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'pharmacie',
      nom: 'Trouver une pharmacie',
      icon: <Building2 className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'garantie',
      nom: 'Lettre de garantie',
      icon: <FileText className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const initiales = `${agent.prenom.charAt(0)}${agent.nom.charAt(0)}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* En-tête avec informations principales */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {initiales}
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {agent.prenom} {agent.nom}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span>{agent.numeroAgent}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{agent.telephone}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{agent.email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{agent.adresse}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>{agent.dateNaissance}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Droplet className="w-5 h-5 text-gray-400" />
                  <span>{agent.groupeSanguin}</span>
                </div>
              </div>
            </div>

            {/* Informations d'adhésion */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 min-w-[250px]">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">ADHÉSION</h3>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">N° Non renseigné</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Date:</p>
                    <p className="text-sm font-medium text-gray-900">{agent.dateAdhesion}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.lieuAdhesion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Section Comptes et Services CHIFT */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            COMPTES ET SERVICES CHIFT
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {comptesServices.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  if (service.id === 'leket') {
                    navigate('/leket');
                  } else if (service.id === 'sokhla') {
                    navigate('/sokhla');
                  }
                  // Ajouter d'autres navigations pour les autres services
                }}
                className={`relative ${service.bgColor} rounded-lg p-6 hover:shadow-md transition-all duration-200 group`}
              >
                {service.active && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                
                <div className={`${service.color} mb-3 flex justify-center`}>
                  {service.icon}
                </div>
                
                <p className={`${service.color} font-semibold text-sm text-center`}>
                  {service.nom}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Section CSU (Couverture Sanitaire Universelle) */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            CSU (COUVERTURE SANITAIRE UNIVERSELLE)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servicesCSU.map((service) => (
              <button
                key={service.id}
                className={`${service.bgColor} rounded-lg p-6 hover:shadow-md transition-all duration-200 group flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${service.color}`}>
                    {service.icon}
                  </div>
                  <p className={`${service.color} font-semibold text-base`}>
                    {service.nom}
                  </p>
                </div>
                
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
