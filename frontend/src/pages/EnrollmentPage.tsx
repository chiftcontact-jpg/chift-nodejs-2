import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle, AlertCircle, UserPlus } from 'lucide-react'
import api from '../lib/api'
import { EnrollmentFormData, REGIONS_SENEGAL, MECANISMES_ENDOGENES, OBJECTIFS_FINANCIERS } from '../types'

const EnrollmentPage = () => {
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [createdAdherent, setCreatedAdherent] = useState<any>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<EnrollmentFormData>({
    defaultValues: {
      typeAdherent: 'individuel',
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
        typeSouscription: data.typeAdherent === 'communautaire' ? 'communautaire' : 'individuelle',
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
      const adherentResponse = await api.post(
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

      return adherentResponse.data
    },
    onSuccess: (data) => {
      setCreatedAdherent(data.data.adherent)
      setSuccess(true)
    }
  })

  const onSubmit = (data: EnrollmentFormData) => {
    mutation.mutate(data)
  }

  const handleNewEnrollment = () => {
    setSuccess(false)
    setCreatedAdherent(null)
    setStep(1)
    reset()
  }

  if (success && createdAdherent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Enrôlement réussi !
            </h2>
            <p className="text-gray-600">
              L'adhérent a été enregistré avec succès dans le système CHIFT
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Numéro adhérent:</span>
              <span className="font-semibold">{createdAdherent.numeroAdherent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nom complet:</span>
              <span className="font-semibold">
                {createdAdherent.prenom} {createdAdherent.nom}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Compte CHIFT:</span>
              <span className="font-semibold">{createdAdherent.compteChift.numeroCompte}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Numéro CSU:</span>
              <span className="font-semibold">{createdAdherent.csu.numeroCSU}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleNewEnrollment}
              className="flex-1 btn btn-primary"
            >
              Nouvel enrôlement
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 btn btn-secondary"
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
          Enregistrement d'un nouvel adhérent dans le système CHIFT
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 ${
                    step > s ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-md mx-auto">
          <span>Informations</span>
          <span>Localisation</span>
          <span>Confirmation</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          {/* Step 1: Informations personnelles */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Informations personnelles
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Prénom *</label>
                  <input
                    {...register('prenom', { required: 'Prénom requis' })}
                    className="input"
                    placeholder="Fatou"
                  />
                  {errors.prenom && (
                    <p className="error-text">{errors.prenom.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Nom *</label>
                  <input
                    {...register('nom', { required: 'Nom requis' })}
                    className="input"
                    placeholder="Diop"
                  />
                  {errors.nom && (
                    <p className="error-text">{errors.nom.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Téléphone *</label>
                  <input
                    {...register('telephone', {
                      required: 'Téléphone requis',
                      pattern: {
                        value: /^[0-9]{9,15}$/,
                        message: 'Numéro invalide'
                      }
                    })}
                    className="input"
                    placeholder="771234567"
                  />
                  {errors.telephone && (
                    <p className="error-text">{errors.telephone.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    type="email"
                    className="input"
                    placeholder="fatou@example.com"
                  />
                  {errors.email && (
                    <p className="error-text">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">CNI</label>
                  <input
                    {...register('cni')}
                    className="input"
                    placeholder="1234567890123"
                  />
                </div>

                <div>
                  <label className="label">Date de naissance *</label>
                  <input
                    {...register('dateNaissance', {
                      required: 'Date de naissance requise'
                    })}
                    type="date"
                    className="input"
                  />
                  {errors.dateNaissance && (
                    <p className="error-text">{errors.dateNaissance.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="label">Profession</label>
                <input
                  {...register('profession')}
                  className="input"
                  placeholder="Commerçante"
                />
              </div>

              <div>
                <label className="label">Type d'adhésion *</label>
                <select {...register('typeAdherent')} className="input">
                  <option value="individuel">Individuel</option>
                  <option value="communautaire">Communautaire</option>
                </select>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Mécanisme endogène de financement
                </h4>

                <div className="mb-4">
                  <label className="flex items-center space-x-3">
                    <input
                      {...register('possedeMecanismeEndogene')}
                      type="checkbox"
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-gray-700">
                      Utilise un mécanisme endogène de financement
                    </span>
                  </label>
                </div>

                {possedeMecanisme && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="label">Type de mécanisme</label>
                      <select
                        {...register('mecanismeEndogene.type')}
                        className="input"
                      >
                        {MECANISMES_ENDOGENES.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Nom du mécanisme</label>
                      <input
                        {...register('mecanismeEndogene.nom')}
                        className="input"
                        placeholder="Tontine des femmes de Parcelles"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Montant cotisation (FCFA)</label>
                        <input
                          {...register('mecanismeEndogene.montantCotisation', {
                            valueAsNumber: true
                          })}
                          type="number"
                          className="input"
                          placeholder="5000"
                        />
                      </div>

                      <div>
                        <label className="label">Fréquence</label>
                        <select
                          {...register('mecanismeEndogene.frequenceCotisation')}
                          className="input"
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
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Localisation
              </h3>

              <div>
                <label className="label">Adresse *</label>
                <input
                  {...register('adresse', { required: 'Adresse requise' })}
                  className="input"
                  placeholder="Parcelles Assainies, Unité 12"
                />
                {errors.adresse && (
                  <p className="error-text">{errors.adresse.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Région *</label>
                  <select
                    {...register('region', { required: 'Région requise' })}
                    className="input"
                  >
                    <option value="">Sélectionner...</option>
                    {REGIONS_SENEGAL.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="error-text">{errors.region.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Département *</label>
                  <input
                    {...register('departement', {
                      required: 'Département requis'
                    })}
                    className="input"
                    placeholder="Dakar"
                  />
                  {errors.departement && (
                    <p className="error-text">{errors.departement.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Commune *</label>
                  <input
                    {...register('commune', { required: 'Commune requise' })}
                    className="input"
                    placeholder="Parcelles Assainies"
                  />
                  {errors.commune && (
                    <p className="error-text">{errors.commune.message}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Communauté et aspirations
                </h4>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      {...register('faitPartieCommunaute')}
                      type="checkbox"
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-gray-700">
                      Fait partie d'une communauté
                    </span>
                  </label>

                  {!faitPartieCommunaute && (
                    <>
                      <label className="flex items-center space-x-3">
                        <input
                          {...register('souhaiteCreerCommunaute')}
                          type="checkbox"
                          className="w-5 h-5 text-primary-600 rounded"
                        />
                        <span className="text-gray-700">
                          Souhaite créer une communauté
                        </span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          {...register('souhaiteEtreAgentCommercial')}
                          type="checkbox"
                          className="w-5 h-5 text-primary-600 rounded"
                        />
                        <span className="text-gray-700">
                          Souhaite devenir agent commercial CHIFT
                        </span>
                      </label>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <label className="label">Objectifs financiers</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {OBJECTIFS_FINANCIERS.map((objectif) => (
                      <label key={objectif} className="flex items-center space-x-2">
                        <input
                          {...register('objectifsFinanciers')}
                          type="checkbox"
                          value={objectif}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{objectif}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Confirmation
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Package CHIFT</p>
                    <p>
                      L'adhérent bénéficiera automatiquement de :
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Compte CHIFT</li>
                      <li>Couverture Santé Universelle (CSU)</li>
                      <li>Carte NFC (à récupérer à la mutuelle)</li>
                      <li>Accès crédit nano et micro</li>
                      <li>Transactions mobile money</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nom complet</p>
                  <p className="font-semibold">
                    {watch('prenom')} {watch('nom')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-semibold">{watch('telephone')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Localisation</p>
                  <p className="font-semibold">
                    {watch('commune')}, {watch('departement')}, {watch('region')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type d'adhésion</p>
                  <p className="font-semibold capitalize">{watch('typeAdherent')}</p>
                </div>
              </div>

              {mutation.isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  Une erreur s'est produite lors de l'enrôlement
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary"
              >
                Précédent
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn btn-primary"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn btn-success flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>
                  {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default EnrollmentPage
