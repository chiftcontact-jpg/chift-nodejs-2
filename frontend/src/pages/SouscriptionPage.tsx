import { FileText } from 'lucide-react'

const SouscriptionPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nouvelle Souscription
        </h1>
        <p className="text-gray-600">
          Créer une demande de souscription pour un nouvel adhérent
        </p>
      </div>

      <div className="card text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Formulaire de souscription
        </h3>
        <p className="text-gray-600 mb-6">
          Cette page permet de créer une nouvelle souscription avant l'enrôlement
        </p>
        <a
          href="/enrolement"
          className="inline-flex items-center space-x-2 btn btn-primary"
        >
          <span>Aller à l'enrôlement</span>
        </a>
      </div>
    </div>
  )
}

export default SouscriptionPage
