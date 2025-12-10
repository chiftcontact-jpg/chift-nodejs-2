import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  ArrowLeft,
  QrCode,
  Download,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Briefcase,
  Users,
  Edit2,
  Trash2
} from 'lucide-react';
import { userAPI } from '../lib/api';
import type { User as UserType } from '../store/authStore';

export const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQR, setLoadingQR] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getById(id!);
      
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!id) return;

    try {
      setLoadingQR(true);
      const response = await userAPI.getQRCode(id);
      
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
    link.download = `qrcode-${user?.username || 'utilisateur'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = () => {
    // Rediriger vers la page d'édition
    navigate(`/utilisateur/${id}/modifier`);
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      await userAPI.delete(id);
      alert('✅ Utilisateur supprimé avec succès');
      navigate('/utilisateurs');
    } catch (error: any) {
      console.error('Erreur suppression utilisateur:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Impossible de supprimer l\'utilisateur'));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'AGENT':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MAKER':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ADHERENT':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'SUPERVISEUR':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-4 h-4" />
            Actif
          </span>
        );
      case 'inactif':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <XCircle className="w-4 h-4" />
            Inactif
          </span>
        );
      case 'suspendu':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-4 h-4" />
            Suspendu
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Utilisateur non trouvé</p>
          <button
            onClick={() => navigate('/utilisateurs')}
            className="text-teal-600 hover:text-teal-700"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/utilisateurs')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Détails de l'utilisateur</h1>
              <p className="text-sm text-gray-500 mt-1">Informations complètes du profil</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Modifier
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Supprimer
            </button>
            <button
              onClick={handleGenerateQRCode}
              disabled={loadingQR}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-lg disabled:opacity-50"
            >
              <QrCode className="w-5 h-5" />
              {loadingQR ? 'Génération...' : 'Voir QR Code'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Info principale */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {user.prenom[0]}{user.nom[0]}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.prenom} {user.nom}</h2>
                <p className="text-sm text-gray-500 mt-1">@{user.username}</p>
                <div className="mt-3">
                  {getStatusBadge(user.statut)}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="text-sm font-medium">{user.telephone}</p>
                  </div>
                </div>

                {user.whatsapp && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <p className="text-sm font-medium">{user.whatsapp}</p>
                    </div>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Créé le</p>
                      <p className="text-sm font-medium">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {user.derniereConnexion && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Dernière connexion</p>
                      <p className="text-sm font-medium">
                        {new Date(user.derniereConnexion).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite - Détails étendus */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identité */}
            {(user.cni || user.profession) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  Identité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.cni && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Numéro CNI</p>
                      <p className="text-sm font-semibold text-gray-900">{user.cni}</p>
                    </div>
                  )}
                  {user.profession && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <p className="text-xs text-gray-500">Profession</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{user.profession}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bénéficiaires */}
            {user.beneficiaires && user.beneficiaires.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Bénéficiaires ({user.beneficiaires.length})
                </h3>
                <div className="space-y-3">
                  {user.beneficiaires.map((beneficiaire, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {beneficiaire.prenom} {beneficiaire.nom}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                              {beneficiaire.relation}
                            </span>
                          </p>
                          {beneficiaire.telephone && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {beneficiaire.telephone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rôles */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Rôles et Permissions
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Rôle principal</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getRoleBadgeColor(user.rolePrincipal)}`}>
                    <Shield className="w-4 h-4" />
                    {user.rolePrincipal}
                  </span>
                </div>

                {user.roles && user.roles.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tous les rôles</p>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((roleDetail, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${getRoleBadgeColor(roleDetail.role)}`}
                        >
                          {roleDetail.role}
                          {roleDetail.actif ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.permissions && user.permissions.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tentatives de connexion</p>
                  <p className="text-2xl font-bold text-gray-900">{user.tentativesConnexion || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Rôles actifs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.roles?.filter(r => r.actif).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR Code */}
      {showQRModal && qrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Utilisateur</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <img src={qrCode} alt="QR Code" className="w-full" />
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                {user.prenom} {user.nom}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <button
              onClick={handleDownloadQR}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Télécharger le QR Code
            </button>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 mb-1">
                      Action irréversible
                    </p>
                    <p className="text-sm text-red-700">
                      Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est définitive et ne peut pas être annulée.
                    </p>
                  </div>
                </div>
              </div>

              {user && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Utilisateur à supprimer :</p>
                  <p className="font-semibold text-gray-900">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Rôle : {user.rolePrincipal}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
