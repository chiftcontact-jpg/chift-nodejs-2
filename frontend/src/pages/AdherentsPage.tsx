import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Eye, Phone, MapPin, Clock } from 'lucide-react'
import api from '../lib/api'
import { Utilisateur } from '../types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const AdherentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['utilisateurs-liste'],
    queryFn: async () => {
      const response = await api.get('/utilisateurs')
      return response.data
    }
  })

  const utilisateurs: Utilisateur[] = data?.data || []

  const filteredUtilisateurs = utilisateurs.filter(
    (u) =>
      u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.telephone.includes(searchTerm) ||
      u.numeroUtilisateur.includes(searchTerm)
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Utilisateurs</h1>
        <p className="text-gray-600">
          Liste complète des utilisateurs enregistrés
        </p>
      </div>

      {/* Search */}
      <div className="card mb-6 shadow-sm border-teal-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou numéro utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12 h-14 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all rounded-2xl"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden border-gray-100">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500 font-medium">Chargement des utilisateurs...</p>
              </div>
            ) : filteredUtilisateurs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredUtilisateurs.map((utilisateur) => (
                  <button
                    key={utilisateur._id}
                    onClick={() => setSelectedUtilisateur(utilisateur)}
                    className={`w-full p-6 text-left hover:bg-teal-50/30 transition-all group ${
                      selectedUtilisateur?._id === utilisateur._id
                        ? 'bg-teal-50/50'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-teal-700 transition-colors">
                            {utilisateur.prenom} {utilisateur.nom}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-lg border shadow-sm uppercase tracking-wider ${
                              utilisateur.statut === 'actif'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {utilisateur.statut}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                              <Phone className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{utilisateur.telephone}</span>
                          </div>
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="font-medium truncate">{utilisateur.commune}, {utilisateur.region}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between self-stretch">
                        <span className="text-xs font-bold text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                          #{utilisateur.numeroUtilisateur}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          selectedUtilisateur?._id === utilisateur._id ? 'bg-teal-500 text-white' : 'bg-gray-50 text-gray-300 group-hover:bg-teal-100 group-hover:text-teal-500'
                        }`}>
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedUtilisateur ? (
            <div className="card sticky top-6 border-teal-100 shadow-xl overflow-hidden p-0">
              <div className="bg-teal-600 p-8 text-white">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                  <span className="text-3xl font-bold">
                    {selectedUtilisateur.prenom[0]}{selectedUtilisateur.nom[0]}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {selectedUtilisateur.prenom} {selectedUtilisateur.nom}
                </h3>
                <p className="text-teal-100 text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse"></span>
                  Utilisateur {selectedUtilisateur.typeUtilisateur}
                </p>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Informations Système</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-500 font-medium">Numéro Utilisateur</span>
                      <span className="font-bold text-teal-600 font-mono bg-white px-3 py-1 rounded-lg shadow-sm border border-teal-50">
                        {selectedUtilisateur.numeroUtilisateur}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-500 font-medium">Date d'adhésion</span>
                      <div className="flex items-center gap-2 text-gray-700 font-bold">
                        <Clock className="w-4 h-4 text-teal-500" />
                        <span>{format(new Date(selectedUtilisateur.createdAt), 'dd MMM yyyy', { locale: fr })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Comptes CHIFT</h4>
                  <div className="space-y-3">
                    <div className="p-4 border-2 border-gray-50 rounded-2xl hover:border-teal-100 transition-colors">
                      <div className="text-xs text-gray-400 font-bold mb-1 uppercase">Compte CHIFT</div>
                      <div className="font-mono font-bold text-gray-900 text-lg">{selectedUtilisateur.compteChift.numeroCompte}</div>
                    </div>
                    <div className="p-4 border-2 border-gray-50 rounded-2xl hover:border-teal-100 transition-colors">
                      <div className="text-xs text-gray-400 font-bold mb-1 uppercase">Numéro CSU</div>
                      <div className="font-mono font-bold text-gray-900 text-lg">{selectedUtilisateur.csu.numeroCSU}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 group">
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Voir le profil complet
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-gray-200 bg-gray-50/50">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                <Eye className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Sélectionnez un utilisateur</h3>
              <p className="text-gray-400 text-sm max-w-[200px]">
                Cliquez sur un utilisateur de la liste pour voir ses détails complets
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdherentsPage
