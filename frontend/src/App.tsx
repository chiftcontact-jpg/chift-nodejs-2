import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import DashboardPage from './pages/DashboardPage'
import EnrollmentPage from './pages/EnrollmentPage'
import SouscriptionPage from './pages/SouscriptionPage'
import AdherentsPage from './pages/AdherentsPage'
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
import { DemandeSokhlaPage } from './pages/DemandeSokhlaPage'
import { DemandeSokhlaChiftPage } from './pages/DemandeSokhlaChiftPage'
import { DemandeSokhlaCommunautairePage } from './pages/DemandeSokhlaCommunautairePage'
import { ComptesServicesPage } from './pages/ComptesServicesPage'
import { ProfilAdminPage } from './pages/ProfilAdminPage'
import { ProfilUtilisateurPage } from './pages/ProfilUtilisateurPage'
import { useAuthStore } from './store/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/reset-password" element={<SetPasswordPage />} />
        
        {isAuthenticated ? (
          <>
            {/* Routes Admin avec AdminLayout */}
            <Route path="/" element={<AdminLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profil-admin" element={<ProfilAdminPage />} />
              <Route path="mon-profil" element={<ProfilUtilisateurPage />} />
              <Route path="utilisateurs" element={<UtilisateursPage />} />
              <Route path="utilisateur/:id" element={<UserDetailsPage />} />
              <Route path="utilisateur/:id/modifier" element={<EditUserPage />} />
              <Route path="caisses" element={<CaissesListPage />} />
              <Route path="reseaux" element={<CommunautesPage />} />
              <Route path="comptes-services" element={<ComptesServicesPage />} />
              <Route path="region/:regionId/departements" element={<RegionDepartementsPage />} />
            </Route>

            {/* Routes Agent avec Layout normal */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="mon-profil" element={<ProfilUtilisateurPage />} />
              <Route path="communautes" element={<CommunautesPage />} />
              <Route path="communaute/:id/caisses" element={<CommunauteCaissesPage />} />
              <Route path="caisse/:id" element={<CaisseDetailsPage />} />
              <Route path="caisse/:id/membres" element={<MembresCaissePage />} />
              <Route path="membre/:id" element={<ProfilMembrePage />} />
              <Route path="profil-agent" element={<ProfilAgentPage />} />
              <Route path="leket" element={<LekketPage />} />
              <Route path="reseau/:id" element={<ReseauDetailsPage />} />
              <Route path="souscription" element={<SouscriptionPage />} />
              <Route path="sokhla" element={<DemandeSokhlaPage />} />
              <Route path="sokhla/chift" element={<DemandeSokhlaChiftPage />} />
              <Route path="sokhla/communautaire" element={<DemandeSokhlaCommunautairePage />} />
              <Route path="enrolement" element={<EnrollmentPage />} />
              <Route path="adherents" element={<AdherentsPage />} />
            </Route>
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
