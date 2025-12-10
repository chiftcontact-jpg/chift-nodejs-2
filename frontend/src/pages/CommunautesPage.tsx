import React, { useState } from 'react';
import { Plus, MapPin, Building2, Map } from 'lucide-react';
import { caisseAPI, agentAPI } from '../lib/api';
import { CreateCaisseLekketModal, CaisseLekketFormData } from '../components/CreateCaisseLekketModal';

interface Communaute {
  id: string;
  nom: string;
  region: string;
  departement: string;
  commune: string;
  nombreCaisses: number;
}

const mockCommunautes: Communaute[] = [
  { id: '1', nom: 'Gorée', region: 'Dakar', departement: 'Dakar', commune: 'Gorée', nombreCaisses: 1 },
  { id: '2', nom: 'Ouakam', region: 'Dakar', departement: 'Dakar', commune: 'Ouakam', nombreCaisses: 1 },
  { id: '3', nom: 'Dalifort', region: 'Dakar', departement: 'Dakar', commune: 'Pikine', nombreCaisses: 1 },
];

export const CommunautesPage: React.FC = () => {
  const [searchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCommunautes = mockCommunautes.filter(com =>
    com.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCaisse = async (data: CaisseLekketFormData) => {
    try {
      let agentId = data.agentId;

      // Si on crée un nouvel agent
      if (data.agentOption === 'new' && data.newAgent) {
        if (!data.newAgent.nom || !data.newAgent.prenom || !data.newAgent.telephone || !data.newAgent.email) {
          alert('Veuillez remplir tous les champs obligatoires de l\'agent');
          return;
        }

        const agentResponse = await agentAPI.create(data.newAgent);
        if (agentResponse?.data?.success) {
          agentId = agentResponse.data.data._id;
          console.log('✅ Agent créé avec ID:', agentId);
        } else {
          throw new Error('Échec de la création de l\'agent');
        }
      }

      // Créer la caisse
      const response = await caisseAPI.create({
        nom: data.nom,
        type: 'CLASSIQUE',
        badge: data.modeleUtilise,
        frequence: data.frequence,
        jour: data.jour,
        region: data.region,
        departement: data.departement,
        arrondissement: data.arrondissement,
        commune: data.commune,
        dateCreationPhysique: data.dateCreationPhysique,
        femmesActives: data.femmesActives,
        hommesActifs: data.hommesActifs,
        echeanceEvenement: data.echeanceEvenement,
        dateEcheance: data.dateEcheance,
        solidarite: data.solidarite,
        tauxInteret: data.tauxInteret ? parseFloat(data.tauxInteret) : 0,
        montantMinimumCotisation: 5000,
        dateCreation: new Date().toISOString(),
      });

      if (response?.data?.success) {
        const caisseId = response.data.data._id;
        const caisseCode = response.data.data.code;

        // Affecter l'agent à la caisse si un agent est sélectionné/créé
        if (agentId) {
          try {
            await caisseAPI.addMaker(caisseId, agentId);
            alert(`✅ Caisse créée avec succès!\nCode: ${caisseCode}\n✅ Agent affecté à la caisse`);
          } catch (error) {
            console.error('Erreur lors de l\'affectation de l\'agent:', error);
            alert(`✅ Caisse créée avec succès!\nCode: ${caisseCode}\n⚠️ Erreur lors de l'affectation de l'agent`);
          }
        } else {
          alert(`✅ Caisse créée avec succès!\nCode: ${caisseCode}`);
        }

        setIsModalOpen(false);
      }
    } catch (error: any) {
      console.error('Erreur création caisse', error);
      const message = error.response?.data?.message || 'Erreur lors de la création de la caisse';
      alert(message);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Créer une caisse
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunautes.map((communaute) => (
            <div key={communaute.id}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-primary-600 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {communaute.nom}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <Map className="w-4 h-4 mr-1" />
                    {communaute.commune}, {communaute.departement}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-1" />
                    {communaute.nombreCaisses} caisse
                  </div>
                </div>

                <div className="px-6 py-4">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Voir les caisses
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateCaisseLekketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCaisse}
      />
    </div>
  );
};
