import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Calendar, Edit2, Trash2, Save, X, Key, QrCode } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../lib/api';

export const ProfilUtilisateurPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, setUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);

  const [formData, setFormData] = useState({
    nom: currentUser?.nom || '',
    prenom: currentUser?.prenom || '',
    telephone: currentUser?.telephone || '',
    whatsapp: currentUser?.whatsapp || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        nom: currentUser.nom || '',
        prenom: currentUser.prenom || '',
        telephone: currentUser.telephone || '',
        whatsapp: currentUser.whatsapp || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      const response = await userAPI.update(currentUser._id, formData);
      
      if (response.data.success) {
        // Mettre à jour l'utilisateur dans le store
        setUser(response.data.data);
        setIsEditing(false);
        alert('✅ Profil mis à jour avec succès');
      }
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Impossible de mettre à jour le profil'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('❌ Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setLoading(true);
      await userAPI.updatePassword(currentUser?._id!, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      alert('✅ Mot de passe mis à jour avec succès');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Erreur mise à jour mot de passe:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Impossible de changer le mot de passe'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      await userAPI.delete(currentUser._id);
      
      alert('✅ Compte supprimé avec succès');
      logout();
      navigate('/login');
    } catch (error: any) {
      console.error('Erreur suppression compte:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Impossible de supprimer le compte'));
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!currentUser?._id) return;

    try {
      setLoadingQR(true);
      const response = await userAPI.getQRCode(currentUser._id);
      
      if (response.data.success) {
        setQrCode(response.data.data.qrCode);
        setShowQRModal(true);
      }
    } catch (error: any) {
      console.error('Erreur génération QR code:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Impossible de générer le QR code'));
    } finally {
      setLoadingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${currentUser?.username || 'utilisateur'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'AGENT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MAKER':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'ADHERENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SUPERVISEUR':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucun utilisateur connecté</p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-3">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {currentUser.prenom} {currentUser.nom}
                </h1>
                <p className="text-blue-100">@{currentUser.username}</p>
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Informations générales */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informations générales
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.prenom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.nom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </label>
                  <p className="text-gray-900 py-2 bg-gray-50 px-4 rounded-lg">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.telephone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{currentUser.whatsapp || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rôles et permissions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Rôles et permissions
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle principal
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(currentUser.rolePrincipal)}`}>
                    {currentUser.rolePrincipal}
                  </span>
                </div>

                {currentUser.roles && currentUser.roles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tous les rôles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.roles.map((role, index) => (
                        <span
                          key={index}
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(role.role)}`}
                        >
                          {role.role}
                          {role.caisseId && (
                            <span className="ml-1 text-xs opacity-75">
                              (Caisse: {role.caisseId.substring(0, 8)}...)
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    currentUser.statut === 'actif' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentUser.statut}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations système */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Informations système
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Dernière connexion:</span>
                  <span className="ml-2 text-gray-900">
                    {currentUser.derniereConnexion 
                      ? new Date(currentUser.derniereConnexion).toLocaleString('fr-FR')
                      : 'Jamais'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tentatives de connexion:</span>
                  <span className="ml-2 text-gray-900">{currentUser.tentativesConnexion || 0}</span>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            {isEditing && (
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      nom: currentUser.nom || '',
                      prenom: currentUser.prenom || '',
                      telephone: currentUser.telephone || '',
                      whatsapp: currentUser.whatsapp || '',
                    });
                  }}
                  className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>
            )}
          </form>

          {/* Actions supplémentaires */}
          {!isEditing && (
            <div className="flex flex-wrap gap-4 justify-between items-center pt-6 border-t mt-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  <span>Changer le mot de passe</span>
                </button>

                <button
                  onClick={handleGenerateQRCode}
                  disabled={loadingQR}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{loadingQR ? 'Génération...' : 'Voir mon QR code'}</span>
                </button>
              </div>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer le compte</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal changement mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Changer le mot de passe
            </h3>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Modification...' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQRModal && qrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <QrCode className="w-6 h-6 mr-2 text-blue-600" />
                Mon QR Code
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <img 
                  src={qrCode} 
                  alt="QR Code utilisateur" 
                  className="w-64 h-64"
                />
              </div>

              <p className="text-sm text-gray-600 text-center mb-4">
                Scannez ce QR code pour accéder à vos informations
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 w-full">
                <p className="text-xs text-blue-800">
                  <strong>Contenu du QR:</strong> ID, nom, prénom, email, téléphone, rôle
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
