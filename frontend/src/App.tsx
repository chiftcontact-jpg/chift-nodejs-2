import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import DashboardPage from './pages/DashboardPage'
import EnrollmentPage from './pages/EnrollmentPage'
import SouscriptionPage from './pages/SouscriptionPage'
import LoginPage from './pages/LoginPage'
import SetPasswordPage from './pages/SetPasswordPage'
import { HomePage } from './pages/HomePage'
import { CommunautesPage } from './pages/CommunautesPage'
import { CaisseDetailsPage } from './pages/CaisseDetailsPage'
import { ProfilMembrePage } from './pages/ProfilMembrePage'
import { MembresCaissePage } from './pages/MembresCaissePage'
import { ProfilAgentPage } from './pages/ProfilAgentPage'
import { LekketPage } from './pages/LekketPage'
import { ReseauDetailsPage } from './pages/ReseauDetailsPage'
import { CommunauteCaissesPage } from './pages/CommunauteCaissesPage'
import { CaissesListPage } from './pages/CaissesListPage'
import { RegionDepartementsPage } from './pages/RegionDepartementsPage'
import { UtilisateursPage } from './pages/UtilisateursPage'
import { UserDetailsPage } from './pages/UserDetailsPage'
import { EditUserPage } from './pages/EditUserPage'
import { NouvelAdherentPage } from './pages/NouvelAdherentPage'
import { DemandeSokhlaPage } from './pages/DemandeSokhlaPage'
import { DemandeSokhlaChiftPage } from './pages/DemandeSokhlaChiftPage'
import { DemandeSokhlaCommunautairePage } from './pages/DemandeSokhlaCommunautairePage'
import { ComptesServicesPage } from './pages/ComptesServicesPage'
import { ProfilAdminPage } from './pages/ProfilAdminPage'
import { ProfilUtilisateurPage } from './pages/ProfilUtilisateurPage'
import { useAuthStore } from './store/authStore'

function App() {
  const { isAuthenticated, user, hasRole } = useAuthStore()
  const [isRehydrated, setIsRehydrated] = React.useState(false)

  React.useEffect(() => {
    // Vérifier si le store est hydraté
    const checkHydration = async () => {
      // @ts-ignore - persist is added by middleware
      if (useAuthStore.persist?.hasHydrated()) {
        setIsRehydrated(true)
      } else {
        // Attendre l'hydratation si pas encore faite
        // @ts-ignore
        const unsub = useAuthStore.persist?.onHydrate(() => setIsRehydrated(false))
        // @ts-ignore
        const unsubFinish = useAuthStore.persist?.onFinishHydration(() => setIsRehydrated(true))
        
        // Sécurité au cas où
        setTimeout(() => setIsRehydrated(true), 500)
        
        return () => {
          unsub?.()
          unsubFinish?.()
        }
      }
    }
    checkHydration()
  }, [])
  
  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isAdmin = hasRole('ADMIN')
  const isAgent = hasRole('AGENT') || hasRole('SUPERVISEUR')
  const isMaker = hasRole('MAKER')
  const isUtilisateur = hasRole('UTILISATEUR')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/reset-password" element={<SetPasswordPage />} />
        
        {isAuthenticated ? (
          <>
            {/* Routes Admin avec AdminLayout */}
            {isAdmin ? (
              <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="mon-profil" element={<ProfilUtilisateurPage />} />
                <Route path="system-users" element={<UtilisateursPage />} />
                <Route path="utilisateur/:id" element={<UserDetailsPage />} />
                <Route path="utilisateur/:id/modifier" element={<EditUserPage />} />
                <Route path="caisses" element={<CaissesListPage />} />
                <Route path="reseaux" element={<CommunautesPage />} />
                <Route path="comptes-services" element={<ComptesServicesPage />} />
                <Route path="region/:regionId/departements" element={<RegionDepartementsPage />} />
                <Route path="utilisateurs" element={<UtilisateursPage />} />
                <Route path="utilisateurs/nouveau" element={<NouvelAdherentPage />} />
                <Route path="system-users/nouveau" element={<NouvelAdherentPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            ) : (
              <Route path="/" element={<Layout />}>
                <Route index element={
                  isAgent ? <Navigate to="/profil-agent" replace /> :
                  isMaker ? <Navigate to="/caisse-details" replace /> :
                  isUtilisateur ? <Navigate to="/profil-membre" replace /> :
                  <HomePage />
                } />
                <Route path="mon-profil" element={<ProfilUtilisateurPage />} />
                <Route path="profil-agent" element={<ProfilAgentPage />} />
                <Route path="profil-membre" element={<ProfilMembrePage />} />
                <Route path="caisse-details" element={<CaisseDetailsPage />} />
                <Route path="communautes" element={<CommunautesPage />} />
                <Route path="communaute/:id/caisses" element={<CommunauteCaissesPage />} />
                <Route path="caisse/:id" element={<CaisseDetailsPage />} />
                <Route path="caisse/:id/membres" element={<MembresCaissePage />} />
                <Route path="membre/:id" element={<ProfilMembrePage />} />
                <Route path="leket" element={<LekketPage />} />
                <Route path="reseau/:id" element={<ReseauDetailsPage />} />
                <Route path="souscription" element={<SouscriptionPage />} />
                <Route path="sokhla" element={<DemandeSokhlaPage />} />
                <Route path="sokhla/chift" element={<DemandeSokhlaChiftPage />} />
                <Route path="sokhla/communautaire" element={<DemandeSokhlaCommunautairePage />} />
                <Route path="enrolement" element={<EnrollmentPage />} />
                <Route path="utilisateurs" element={<UtilisateursPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            )
          }
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
