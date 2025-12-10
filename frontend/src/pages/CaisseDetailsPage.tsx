import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Calendar, Edit2, Plus, Search, 
  MapPin, Building2, Wallet, TrendingUp, UserCog,
  Clock, Award, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { caisseAPI, agentAPI } from '../lib/api';

interface Agent {
  _id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
}

interface Caisse {
  _id: string;
  nom: string;
  code: string;
  type: 'LEKKET' | 'CLASSIQUE';
  statut: 'active' | 'inactive' | 'suspendue';
  badge?: 'Avec' | 'Sans' | 'Djambal' | 'Madial';
  region: string;
  departement: string;
  arrondissement?: string;
  commune: string;
  adresse?: string;
  solde: number;
  montantMinimumCotisation: number;
  montantMaximumCotisation?: number;
  tauxInteret?: number;
  solidarite?: number;
  nombreMembres: number;
  femmesActives?: number;
  hommesActifs?: number;
  capaciteMaximale?: number;
  frequence?: string;
  jour?: string;
  echeanceEvenement?: string;
  dateEcheance?: string;
  responsableId?: string;
  responsableNom?: string;
  responsableContact?: string;
  dateCreation: string;
  dateCreationPhysique?: string;
  dateDerniereActivite?: string;
  description?: string;
  reseauId?: string;
  communauteId?: string;
}

export const CaisseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caisse, setCaisse] = useState<Caisse | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    fetchCaisse();
    fetchAgents();
  }, [id]);

  const fetchCaisse = async () => {
    try {
      setLoading(true);
      const response = await caisseAPI.getById(id!);
      setCaisse(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la caisse:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await agentAPI.getAll();
      setAgents(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedAgentId || !caisse) return;
    
    try {
      const selectedAgent = agents.find(a => a._id === selectedAgentId);
      await caisseAPI.update(caisse._id, {
        responsableId: selectedAgentId,
        responsableNom: `${selectedAgent?.prenom} ${selectedAgent?.nom}`,
        responsableContact: selectedAgent?.telephone
      });
      setShowAssignModal(false);
      fetchCaisse();
      alert('Agent assigné avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      alert('Erreur lors de l\'assignation de l\'agent');
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

  if (!caisse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-900">Caisse introuvable</p>
        </div>
      </div>
    );
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspendue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'LEKKET' 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-gray-50">
      {/* Header moderne */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/caisses')}
              className="text-white hover:text-teal-100 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour aux caisses</span>
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <UserCog className="w-4 h-4" />
                Assigner Agent
              </button>
              <button className="bg-white hover:bg-teal-50 text-teal-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium">
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Informations de la caisse */}
          <div className="lg:col-span-1 space-y-6">
            {/* Carte principale */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              {/* Header avec bordure colorée selon type */}
              <div className={`h-2 ${caisse.type === 'LEKKET' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-teal-500'}`} />
              
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${caisse.type === 'LEKKET' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-teal-500'}`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{caisse.nom}</h2>
                    <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block mt-1">
                      {caisse.code}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getTypeColor(caisse.type)} shadow-sm`}>
                    {caisse.type}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatutColor(caisse.statut)} shadow-sm`}>
                    {caisse.statut === 'active' ? '✓ Active' : caisse.statut === 'inactive' ? '○ Inactive' : '✕ Suspendue'}
                  </span>
                  {caisse.badge && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm">
                      {caisse.badge}
                    </span>
                  )}
                </div>

                {caisse.description && (
                  <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                    {caisse.description}
                  </p>
                )}
              </div>

              {/* Stats rapides */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <Users className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{caisse.nombreMembres}</p>
                    <p className="text-xs text-gray-600">Membres</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{caisse.frequence || 'N/A'}</p>
                    <p className="text-xs text-gray-600">Fréquence</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{caisse.jour || 'N/A'}</p>
                    <p className="text-xs text-gray-600">Jour</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-3">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-bold">Localisation</h3>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Région</span>
                  <span className="font-semibold text-gray-900">{caisse.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Département</span>
                  <span className="font-semibold text-gray-900">{caisse.departement}</span>
                </div>
                {caisse.arrondissement && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Arrondissement</span>
                    <span className="font-semibold text-gray-900">{caisse.arrondissement}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Commune</span>
                  <span className="font-semibold text-gray-900">{caisse.commune}</span>
                </div>
                {caisse.adresse && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Adresse</span>
                    <p className="font-medium text-gray-900 mt-1">{caisse.adresse}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Responsable */}
            {caisse.responsableNom && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
                  <div className="flex items-center gap-2 text-white">
                    <UserCog className="w-5 h-5" />
                    <h3 className="font-bold">Agent Responsable</h3>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nom</span>
                    <span className="font-semibold text-gray-900">{caisse.responsableNom}</span>
                  </div>
                  {caisse.responsableContact && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Contact</span>
                      <span className="font-semibold text-gray-900">{caisse.responsableContact}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite - Informations détaillées */}
          <div className="lg:col-span-2 space-y-6">
            {/* Actions rapides */}
            <div className="flex gap-3 justify-end">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md">
                <Wallet className="w-5 h-5" />
                Faire un dépôt
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md">
                <Plus className="w-5 h-5" />
                Ajouter Membre
              </button>
            </div>

            {/* Solde total */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Wallet className="w-8 h-8" />
                <h3 className="text-xl font-semibold">Solde Total</h3>
              </div>
              <p className="text-5xl font-bold mb-2">{caisse.solde.toLocaleString()}</p>
              <p className="text-lg text-green-100">FCFA</p>
            </div>

            {/* Statistiques membres */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Composition des Membres</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
                    <Users className="w-10 h-10 text-teal-600 mx-auto mb-2" />
                    <div className="text-4xl font-bold text-gray-900">{caisse.nombreMembres}</div>
                    <div className="text-sm text-gray-600 mt-1">Total</div>
                    {caisse.capaciteMaximale && (
                      <div className="text-xs text-gray-500 mt-1">sur {caisse.capaciteMaximale}</div>
                    )}
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                    <div className="text-4xl font-bold text-pink-600">{caisse.femmesActives || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Femmes</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {caisse.nombreMembres > 0 ? Math.round(((caisse.femmesActives || 0) / caisse.nombreMembres) * 100) : 0}%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <div className="text-4xl font-bold text-blue-600">{caisse.hommesActifs || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Hommes</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {caisse.nombreMembres > 0 ? Math.round(((caisse.hommesActifs || 0) / caisse.nombreMembres) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations financières détaillées */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Détails Financiers</h3>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Cotisation Minimum</p>
                  <p className="text-2xl font-bold text-blue-600">{caisse.montantMinimumCotisation.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">FCFA</p>
                </div>
                {caisse.montantMaximumCotisation && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Cotisation Maximum</p>
                    <p className="text-2xl font-bold text-purple-600">{caisse.montantMaximumCotisation.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">FCFA</p>
                  </div>
                )}
                {caisse.tauxInteret && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-100">
                    <p className="text-sm text-gray-600 mb-1">Taux d'Intérêt</p>
                    <p className="text-2xl font-bold text-orange-600">{caisse.tauxInteret}%</p>
                    <p className="text-xs text-gray-500">Annuel</p>
                  </div>
                )}
                {caisse.solidarite && (
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-1">Solidarité</p>
                    <p className="text-2xl font-bold text-pink-600">{caisse.solidarite.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">FCFA</p>
                  </div>
                )}
              </div>
            </div>

            {/* Échéances et événements */}
            {(caisse.echeanceEvenement || caisse.dateEcheance) && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Échéances & Événements</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {caisse.echeanceEvenement && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div>
                        <p className="text-sm text-gray-600">Événement</p>
                        <p className="text-lg font-bold text-gray-900">{caisse.echeanceEvenement}</p>
                      </div>
                      <Award className="w-8 h-8 text-amber-600" />
                    </div>
                  )}
                  {caisse.dateEcheance && (
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="text-sm text-gray-600">Date d'échéance</p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(caisse.dateEcheance).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dates importantes */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Dates Importantes</h3>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date de création (système)</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(caisse.dateCreation).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {caisse.dateCreationPhysique && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date de création physique</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(caisse.dateCreationPhysique).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {caisse.dateDerniereActivite && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dernière activité</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(caisse.dateDerniereActivite).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'assignation d'agent */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <UserCog className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Assigner un Agent</h3>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Sélectionnez un agent à assigner comme responsable de cette caisse
              </p>

              {caisse.responsableNom && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Responsable actuel :</strong> {caisse.responsableNom}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Agent <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Sélectionner un agent --</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.prenom} {agent.nom} ({agent.telephone})
                    </option>
                  ))}
                </select>
              </div>

              {agents.length === 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Aucun agent disponible. Veuillez créer un agent d'abord.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAssignAgent}
                disabled={!selectedAgentId}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-md flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Assigner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
