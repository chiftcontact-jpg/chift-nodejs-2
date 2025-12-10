import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Phone, Mail, MapPin, Calendar, Droplet, Users, ArrowRight } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { ServiceCard } from '../components/ServiceCard';
import { Wallet, Heart, Banknote, ShieldAlert, Coins } from 'lucide-react';

export const ProfilMembrePage: React.FC = () => {
  const navigate = useNavigate();
  const membre = {
    prenom: 'ASTOU',
    nom: 'SARR',
    cni: '1234567890',
    telephone: '771239834',
    email: 'sarr@chift.com',
    commune: 'Ouakam',
    dateNaissance: '2025-07-05',
    groupeSanguin: 'A+',
    adhesion: {
      numero: 'N° SN-DAKAR-DAKAR-OUAKAM-0003',
      date: '04/07/2025',
      localisation: 'Dakar - Ouakam',
      ayansDroit: 2,
    },
  };

  const services = [
    { name: 'LEKET', icon: Wallet, color: 'text-blue-600', bgColor: 'bg-blue-50', disabled: false, onClick: () => navigate('/leket') },
    { name: 'SOKHLA', icon: Heart, color: 'text-purple-600', bgColor: 'bg-purple-50', disabled: false, onClick: () => navigate('/sokhla') },
    { name: 'NATT', icon: Banknote, color: 'text-green-600', bgColor: 'bg-green-50', disabled: true },
    { name: 'CONDAMNE', icon: ShieldAlert, color: 'text-red-600', bgColor: 'bg-red-50', disabled: true },
    { name: 'LEEB', icon: Coins, color: 'text-yellow-600', bgColor: 'bg-yellow-50', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Informations personnelles */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Avatar et nom */}
              <div className="flex flex-col items-center mb-6">
                <Avatar name={`${membre.prenom} ${membre.nom}`} size="xl" color="bg-blue-600" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {membre.prenom} {membre.nom}
                </h2>
              </div>

              {/* Informations */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm">{membre.cni}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm">{membre.telephone}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm">{membre.email}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm">{membre.commune}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm">{membre.dateNaissance}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Droplet className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-sm font-semibold">{membre.groupeSanguin}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Adhésion et services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Adhésion */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-sm border border-green-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ADHÉSION</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <CreditCard className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium">{membre.adhesion.numero}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm">Date: {membre.adhesion.date}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm">{membre.adhesion.localisation}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm">{membre.adhesion.ayansDroit} Ayants droit</span>
                  </div>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                    Voir les ayants droit
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Services CHIFT */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                COMPTES ET SERVICES CHIFT
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {services.map((service) => (
                  <ServiceCard
                    key={service.name}
                    icon={service.icon}
                    name={service.name}
                    color={service.color}
                    bgColor={service.bgColor}
                    disabled={service.disabled}
                    onClick={service.onClick}
                  />
                ))}
              </div>
            </div>

            {/* CSU */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                CSU (COUVERTURE SANITAIRE UNIVERSELLE)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className="font-medium text-purple-700">Trouver un médecin</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <span className="font-medium text-green-700">Trouver une pharmacie</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-medium text-blue-700">Lettre de garantie</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
