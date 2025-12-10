import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CheckCircle,
  Edit,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const ProfilAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Profil Administrateur</h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Retour au Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* User Header Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user.prenom.charAt(0)}{user.nom.charAt(0)}
                  </span>
                </div>

                {/* User Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.prenom} {user.nom}
                    </h1>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      ADMINISTRATEUR
                    </span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Statut:</span>
                      <span className="text-green-600 font-medium">Actif</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">ID:</span>
                      <span className="text-gray-900 font-medium">{user.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Informations de contact */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">EMAIL</p>
                    <p className="text-base font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Téléphone */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">TÉLÉPHONE</p>
                    <p className="text-base font-medium text-gray-900">+221 77 000 00 00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations administratives */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations administratives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rôle */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">RÔLE</p>
                    <p className="text-base font-medium text-gray-900">Administrateur Système</p>
                  </div>
                </div>
              </div>

              {/* Date de création */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">COMPTE CRÉÉ LE</p>
                    <p className="text-base font-medium text-gray-900">01 janvier 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions et accès */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Permissions et accès</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Accès complet au système</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    En tant qu'administrateur, vous avez accès à toutes les fonctionnalités de la plateforme CHIFT.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Gestion des utilisateurs',
                      'Gestion des caisses',
                      'Gestion des réseaux',
                      'Comptes et services',
                      'Tableaux de bord',
                      'Rapports et statistiques',
                      'Configuration système',
                      'Logs et audit'
                    ].map((permission, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
