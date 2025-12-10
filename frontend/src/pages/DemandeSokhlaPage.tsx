import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, ArrowRight, Info } from 'lucide-react';

export const DemandeSokhlaPage: React.FC = () => {
  const navigate = useNavigate();

  const handleChiftSokhla = () => {
    // Navigation vers le formulaire de demande SOKHLA CHIFT
    navigate('/sokhla/chift');
  };

  const handleCommunautaireSokhla = () => {
    // Navigation vers le formulaire de demande SOKHLA COMMUNAUTAIRE
    navigate('/sokhla/communautaire');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DEMANDE SOKHLA</h1>
          <p className="text-gray-600">Choisissez le type d'aide adapté à votre situation</p>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* SOKHLA CHIFT */}
          <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-lg">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 mx-auto">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                SOKHLA CHIFT
              </h2>
              
              <p className="text-gray-600 text-center mb-6">
                Demande d'aide financière directement auprès de CHIFT
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Traitement centralisé</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Montant : 501 000 à 2 000 000 FCFA</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Évaluation personnalisée</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Accompagnement dédié</span>
                </div>
              </div>

              <button
                onClick={handleChiftSokhla}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Choisir cette option
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SOKHLA COMMUNAUTAIRE */}
          <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-lg">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                SOKHLA COMMUNAUTAIRE
              </h2>
              
              <p className="text-gray-600 text-center mb-6">
                Demande d'aide auprès de votre communauté locale
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Traitement communautaire</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Montant : 1000 à 500 000 FCFA</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Solidarité locale</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Procédure simple</span>
                </div>
              </div>

              <button
                onClick={handleCommunautaireSokhla}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Choisir cette option
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Informations importantes</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Traitement sous 48-72h ouvrables</li>
                <li>• Justificatifs requis selon le montant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
