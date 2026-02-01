import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogIn } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('papseynidiakhate@gmail.com')
  const [password, setPassword] = useState('1234')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Appel API via le Gateway
      const { authAPI } = await import('../lib/api')
      const response = await authAPI.login(email, password)
      console.log('Login success:', response)
      
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data
        login(user, token, refreshToken)
        
        // Redirection forcée vers le changement de mot de passe si nécessaire
        if (user.mustChangePassword) {
          window.location.href = '/mon-profil'
          return
        }

        // Redirection selon le rôle principal via window.location pour assurer un reset de l'état si besoin
        if (user.rolePrincipal === 'ADMIN') {
          window.location.href = '/dashboard'
        } else if (user.rolePrincipal === 'AGENT' || user.rolePrincipal === 'SUPERVISEUR') {
          window.location.href = '/profil-agent'
        } else if (user.rolePrincipal === 'MAKER') {
          window.location.href = '/caisse-details'
        } else if (user.rolePrincipal === 'UTILISATEUR') {
          window.location.href = '/profil-membre'
        } else {
          window.location.href = '/'
        }
      } else {
        setError(response.data.message || 'Erreur de connexion')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Identifiants invalides'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-chift-green/10 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Connexion</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@chift.com"
                required
              />
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Info box for demo credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Accès Administrateur :</p>
              <div className="space-y-2 text-sm text-blue-800">
                <div>
                  <p className="font-medium">👨‍💼 Super Admin (Image) :</p>
                  <p className="ml-4">Email: <code className="bg-blue-100 px-2 py-0.5 rounded">papseynidiakhate@gmail.com</code></p>
                  <p className="ml-4">Mot de passe: <code className="bg-blue-100 px-2 py-0.5 rounded">1234</code></p>
                </div>
                <hr className="border-blue-100" />
                <div>
                  <p className="font-medium">👨‍💻 Admin Standard :</p>
                  <p className="ml-4">Email: <code className="bg-blue-100 px-2 py-0.5 rounded">admin@chift.sn</code></p>
                  <p className="ml-4">Mot de passe: <code className="bg-blue-100 px-2 py-0.5 rounded">Admin123!</code></p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 CHIFT - Tous droits réservés
        </p>
      </div>
    </div>
  )
}

export default LoginPage
