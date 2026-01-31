import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle, AlertCircle, UserPlus } from 'lucide-react'
import api from '../lib/api'
import { EnrollmentFormData, REGIONS_SENEGAL, MECANISMES_ENDOGENES, OBJECTIFS_FINANCIERS } from '../types'

const EnrollmentPage = () => {
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [createdUser, setCreatedUser] = useState<any>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<EnrollmentFormData>({
    defaultValues: {
      typeUtilisateur: 'individuel',
      possedeMecanismeEndogene: false,
      faitPartieCommunaute: false
    }
  })

  const possedeMecanisme = watch('possedeMecanismeEndogene')
  const faitPartieCommunaute = watch('faitPartieCommunaute')

  const mutation = useMutation({
    mutationFn: async (data: EnrollmentFormData) => {
      // Créer d'abord la souscription
      const souscriptionResponse = await api.post('/souscriptions', {
        typeSouscription: data.typeUtilisateur === 'communautaire' ? 'communautaire' : 'individuelle',
        questionnaire: {
          possedeMecanismeEndogene: data.possedeMecanismeEndogene,
          typeMecanisme: data.mecanismeEndogene?.type,
          faitPartieCommunaute: data.faitPartieCommunaute,
          souhaiteCreerCommunaute: data.souhaiteCreerCommunaute,
          souhaiteEtreAgentCommercial: data.souhaiteEtreAgentCommercial,
          activiteProfessionnelle: data.profession,
          objectifsFinanciers: data.objectifsFinanciers
        },
        packageSouscrit: {
          compteChift: true,
          csu: true,
          carteNFC: true,
          accesCredit: { nano: true, micro: true },
          mobileMoney: true
        }
      })

      // Puis traiter l'enrôlement
      const userResponse = await api.post(
        `/souscriptions/${souscriptionResponse.data.data._id}/enrolement`,
        {
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          email: data.email,
          cni: data.cni,
          dateNaissance: data.dateNaissance,
          profession: data.profession,
          adresse: data.adresse,
          region: data.region,
          departement: data.departement,
          commune: data.commune
        }
      )

      return userResponse.data
    },
    onSuccess: (data) => {
      setCreatedUser(data.data.utilisateur || data.data.adherent)
      setSuccess(true)
    }
  })

  const onSubmit = (data: EnrollmentFormData) => {
    mutation.mutate(data)
  }

  const handleNewEnrollment = () => {
    setSuccess(false)
    setCreatedUser(null)
    setStep(1)
    reset()
  }

  if (success && createdUser) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card shadow-lg border-teal-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 rounded-full mb-4 shadow-inner">
              <CheckCircle className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Enrôlement réussi !
            </h2>
            <p className="text-gray-600">
              L'utilisateur a été enregistré avec succès dans le système CHIFT
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Numéro utilisateur:</span>
              <span className="font-bold text-teal-600 font-mono">{createdUser.numeroUtilisateur}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Nom complet:</span>
              <span className="font-bold text-gray-900">
                {createdUser.prenom} {createdUser.nom}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Compte CHIFT:</span>
              <span className="font-bold text-gray-900 font-mono">{createdUser.compteChift.numeroCompte}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Numéro CSU:</span>
              <span className="font-bold text-gray-900 font-mono">{createdUser.csu.numeroCSU}</span>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleNewEnrollment}
              className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Nouvel enrôlement
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 hover:border-teal-500 hover:text-teal-600 text-gray-600 font-bold rounded-xl transition-all shadow-sm"
            >
              Imprimer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Formulaire d'Enrôlement
        </h1>
        <p className="text-gray-600">
          Enregistrement d'un nouvel utilisateur dans le système CHIFT
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 shadow-sm ${
                    step >= s
                      ? 'bg-teal-600 text-white shadow-teal-200'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                  {s === 1 ? 'Infos' : s === 2 ? 'Lieu' : 'Fin'}
                </div>
              </div>
              {s < 3 && (
                <div
                  className={`w-24 h-1 mx-2 rounded-full transition-all duration-500 ${
                    step > s ? 'bg-teal-600' : 'bg-gray-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card shadow-xl border-gray-100 p-8">
          {/* Step 1: Informations personnelles */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  Informations personnelles
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Prénom *</label>
                  <input
                    {...register('prenom', { required: 'Prénom requis' })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                    placeholder="Fatou"
                  />
                  {errors.prenom && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.prenom.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Nom *</label>
                  <input
                    {...register('nom', { required: 'Nom requis' })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                    placeholder="Diop"
                  />
                  {errors.nom && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.nom.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Téléphone *</label>
                  <input
                    {...register('telephone', {
                      required: 'Téléphone requis',
                      pattern: {
                        value: /^[0-9]{9,15}$/,
                        message: 'Numéro invalide'
                      }
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                    placeholder="771234567"
                  />
                  {errors.telephone && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.telephone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                  <input
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                    placeholder="fatou@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">CNI</label>
                  <input
                    {...register('cni')}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                    placeholder="1234567890123"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Date de naissance *</label>
                  <input
                    {...register('dateNaissance', {
                      required: 'Date de naissance requise'
                    })}
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                  />
                  {errors.dateNaissance && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.dateNaissance.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Profession</label>
                  <input
                    {...register('profession')}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                    placeholder="Commerçante"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Type d'utilisateur *</label>
                  <select 
                    {...register('typeUtilisateur')} 
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="individuel">Individuel</option>
                    <option value="communautaire">Communautaire</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Mécanisme endogène de financement
                  </h4>
                </div>

                <div className="mb-6">
                  <label className="flex items-center space-x-4 group cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        {...register('possedeMecanismeEndogene')}
                        type="checkbox"
                        className="w-6 h-6 text-teal-600 rounded-lg border-2 border-gray-200 focus:ring-teal-500/20 transition-all cursor-pointer"
                      />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-teal-600 transition-colors">
                      Utilise un mécanisme endogène de financement
                    </span>
                  </label>
                </div>

                {possedeMecanisme && (
                  <div className="space-y-6 bg-amber-50/30 p-6 rounded-2xl border-2 border-amber-100 animate-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-800 ml-1 uppercase tracking-wider">Type de mécanisme</label>
                        <select
                          {...register('mecanismeEndogene.type')}
                          className="w-full px-4 py-3 bg-white border-2 border-amber-100 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none appearance-none cursor-pointer"
                        >
                          {MECANISMES_ENDOGENES.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-800 ml-1 uppercase tracking-wider">Nom du mécanisme</label>
                        <input
                          {...register('mecanismeEndogene.nom')}
                          className="w-full px-4 py-3 bg-white border-2 border-amber-100 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                          placeholder="Tontine des femmes de Parcelles"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-800 ml-1 uppercase tracking-wider">Montant cotisation (FCFA)</label>
                        <input
                          {...register('mecanismeEndogene.montantCotisation', {
                            valueAsNumber: true
                          })}
                          type="number"
                          className="w-full px-4 py-3 bg-white border-2 border-amber-100 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                          placeholder="5000"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-800 ml-1 uppercase tracking-wider">Fréquence</label>
                        <select
                          {...register('mecanismeEndogene.frequenceCotisation')}
                          className="w-full px-4 py-3 bg-white border-2 border-amber-100 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none appearance-none cursor-pointer"
                        >
                          <option value="journalier">Journalier</option>
                          <option value="hebdomadaire">Hebdomadaire</option>
                          <option value="mensuel">Mensuel</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Localisation */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  Localisation
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Adresse *</label>
                <input
                  {...register('adresse', { required: 'Adresse requise' })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                  placeholder="Parcelles Assainies, Unité 12"
                />
                {errors.adresse && (
                  <p className="text-xs font-medium text-red-500 ml-1">{errors.adresse.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Région *</label>
                  <select
                    {...register('region', { required: 'Région requise' })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Sélectionner...</option>
                    {REGIONS_SENEGAL.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.region.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Département *</label>
                  <input
                    {...register('departement', {
                      required: 'Département requis'
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                    placeholder="Dakar"
                  />
                  {errors.departement && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.departement.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Commune *</label>
                  <input
                    {...register('commune', { required: 'Commune requise' })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                    placeholder="Parcelles Assainies"
                  />
                  {errors.commune && (
                    <p className="text-xs font-medium text-red-500 ml-1">{errors.commune.message}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Communauté et aspirations
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-4 group cursor-pointer p-4 bg-gray-50 rounded-2xl hover:bg-teal-50 transition-all border-2 border-transparent hover:border-teal-100">
                      <input
                        {...register('faitPartieCommunaute')}
                        type="checkbox"
                        className="w-6 h-6 text-teal-600 rounded-lg border-2 border-gray-200 focus:ring-teal-500/20 transition-all cursor-pointer"
                      />
                      <span className="text-gray-700 font-bold group-hover:text-teal-700 transition-colors">
                        Fait partie d'une communauté
                      </span>
                    </label>

                    {!faitPartieCommunaute && (
                      <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                        <label className="flex items-center space-x-4 group cursor-pointer p-4 bg-gray-50 rounded-2xl hover:bg-teal-50 transition-all border-2 border-transparent hover:border-teal-100">
                          <input
                            {...register('souhaiteCreerCommunaute')}
                            type="checkbox"
                            className="w-6 h-6 text-teal-600 rounded-lg border-2 border-gray-200 focus:ring-teal-500/20 transition-all cursor-pointer"
                          />
                          <span className="text-gray-700 font-bold group-hover:text-teal-700 transition-colors">
                            Souhaite créer une communauté
                          </span>
                        </label>

                        <label className="flex items-center space-x-4 group cursor-pointer p-4 bg-gray-50 rounded-2xl hover:bg-teal-50 transition-all border-2 border-transparent hover:border-teal-100">
                          <input
                            {...register('souhaiteEtreAgentCommercial')}
                            type="checkbox"
                            className="w-6 h-6 text-teal-600 rounded-lg border-2 border-gray-200 focus:ring-teal-500/20 transition-all cursor-pointer"
                          />
                          <span className="text-gray-700 font-bold group-hover:text-teal-700 transition-colors">
                            Souhaite devenir agent commercial
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border-2 border-transparent">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">Objectifs financiers</label>
                    <div className="grid grid-cols-1 gap-3">
                      {OBJECTIFS_FINANCIERS.map((objectif) => (
                        <label key={objectif} className="flex items-center space-x-3 group cursor-pointer">
                          <input
                            {...register('objectifsFinanciers')}
                            type="checkbox"
                            value={objectif}
                            className="w-5 h-5 text-teal-600 rounded border-2 border-gray-200 focus:ring-teal-500/20 transition-all cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-teal-600 transition-colors">{objectif}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  Récapitulatif & Confirmation
                </h3>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-indigo-50 border border-teal-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-teal-900 mb-2 uppercase tracking-wider">Package CHIFT Automatique</p>
                    <p className="text-sm text-teal-800 leading-relaxed mb-4">
                      L'utilisateur bénéficiera de l'ensemble des services de l'écosystème :
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        'Compte CHIFT (Mobile Banking)',
                        'Couverture Santé (CSU)',
                        'Carte NFC Mutuelle',
                        'Accès Crédit Nano/Micro',
                        'Transactions Mobile Money'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-white/50 px-3 py-2 rounded-lg border border-teal-100/50">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Identité</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Prénom</p>
                      <p className="font-bold text-gray-900">{watch('prenom')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Nom</p>
                      <p className="font-bold text-gray-900">{watch('nom')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Téléphone</p>
                      <p className="font-bold text-teal-600">{watch('telephone')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Localisation</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Adresse complète</p>
                    <p className="font-bold text-gray-900 leading-relaxed">
                      {watch('adresse')}
                      <br />
                      <span className="text-teal-600">{watch('commune')}</span>, {watch('departement')}
                      <br />
                      <span className="text-gray-400 text-[10px]">{watch('region')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
              >
                Précédent
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95"
              >
                Continuer
              </button>
            ) : (
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-10 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Traitement...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Valider l'enrôlement
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default EnrollmentPage
