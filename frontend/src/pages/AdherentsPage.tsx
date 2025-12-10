import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Eye, Phone, MapPin } from 'lucide-react'
import api from '../lib/api'
import { Adherent } from '../types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const AdherentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAdherent, setSelectedAdherent] = useState<Adherent | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['adherents'],
    queryFn: async () => {
      const response = await api.get('/adherents')
      return response.data
    }
  })

  const adherents: Adherent[] = data?.data || []

  const filteredAdherents = adherents.filter(
    (a) =>
      a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.telephone.includes(searchTerm) ||
      a.numeroAdherent.includes(searchTerm)
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adhérents</h1>
        <p className="text-gray-600">
          Liste complète des adhérents enregistrés
        </p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou numéro adhérent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2">
          <div className="card p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Chargement...
              </div>
            ) : filteredAdherents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucun adhérent trouvé
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredAdherents.map((adherent) => (
                  <button
                    key={adherent._id}
                    onClick={() => setSelectedAdherent(adherent)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedAdherent?._id === adherent._id
                        ? 'bg-primary-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {adherent.prenom} {adherent.nom}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              adherent.statut === 'actif'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {adherent.statut}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{adherent.telephone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{adherent.commune}, {adherent.region}</span>
                          </div>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                      <span>N° {adherent.numeroAdherent}</span>
                      <span>•</span>
                      <span className="capitalize">{adherent.typeAdherent}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedAdherent ? (
            <div className="card sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Détails de l'adhérent
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nom complet</p>
                  <p className="font-semibold">
                    {selectedAdherent.prenom} {selectedAdherent.nom}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Numéro adhérent</p>
                  <p className="font-semibold font-mono">
                    {selectedAdherent.numeroAdherent}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                  <p className="font-semibold">{selectedAdherent.telephone}</p>
                </div>

                {selectedAdherent.email && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold">{selectedAdherent.email}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">Adresse</p>
                  <p className="font-semibold">
                    {selectedAdherent.adresse}
                    <br />
                    {selectedAdherent.commune}, {selectedAdherent.departement}
                    <br />
                    {selectedAdherent.region}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Package CHIFT
                  </h4>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Compte CHIFT</p>
                      <p className="font-mono text-sm">
                        {selectedAdherent.compteChift.numeroCompte}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Numéro CSU</p>
                      <p className="font-mono text-sm">
                        {selectedAdherent.csu.numeroCSU}
                      </p>
                    </div>

                    {selectedAdherent.carteNFC && (
                      <div>
                        <p className="text-sm text-gray-600">Carte NFC</p>
                        <p className="font-mono text-sm">
                          {selectedAdherent.carteNFC.numeroSerie}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedAdherent.carteNFC.statut}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedAdherent.mecanismeEndogene && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Mécanisme endogène
                    </h4>
                    <p className="text-sm capitalize">
                      {selectedAdherent.mecanismeEndogene.type}
                    </p>
                    {selectedAdherent.mecanismeEndogene.nom && (
                      <p className="text-sm text-gray-600">
                        {selectedAdherent.mecanismeEndogene.nom}
                      </p>
                    )}
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Enregistré le{' '}
                    {format(
                      new Date(selectedAdherent.createdAt),
                      'dd MMMM yyyy',
                      { locale: fr }
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Sélectionnez un adhérent pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdherentsPage
