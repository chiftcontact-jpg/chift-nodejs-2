import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogIn } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data
        login(user, token, refreshToken)
        
        // Redirection selon le rôle principal
        if (user.rolePrincipal === 'ADMIN') {
          navigate('/dashboard')
        } else if (user.rolePrincipal === 'AGENT') {
          navigate('/profil-agent')
        } else if (user.rolePrincipal === 'MAKER') {
          navigate('/caisse-details') // Rediriger vers sa caisse
        } else if (user.rolePrincipal === 'ADHERENT') {
          navigate('/profil-membre')
        } else {
          navigate('/dashboard')
        }
      } else {
        setError(response.data.message || 'Erreur de connexion')
      }
    } catch (err: any) {
      console.error('Erreur login:', err)
      const errorMessage = err.response?.data?.message || 'Identifiants invalides'
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
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Comptes de démonstration :</p>
              <div className="space-y-2 text-sm text-blue-800">
                <div>
                  <p className="font-medium">👨‍💼 Administrateur :</p>
                  <p className="ml-4">Email: <code className="bg-blue-100 px-2 py-0.5 rounded">admin@chift.com</code></p>
                  <p className="ml-4">Mot de passe: <code className="bg-blue-100 px-2 py-0.5 rounded">admin123</code></p>
                </div>
                <div>
                  <p className="font-medium">👤 Agent :</p>
                  <p className="ml-4">Email: <code className="bg-blue-100 px-2 py-0.5 rounded">agent@chift.com</code></p>
                  <p className="ml-4">Mot de passe: <code className="bg-blue-100 px-2 py-0.5 rounded">agent123</code></p>
                </div>
              </div>
            </div> */}

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
