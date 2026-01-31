import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'ADMIN' | 'AGENT' | 'SUPERVISEUR' | 'MAKER' | 'UTILISATEUR'

export interface UserRoleDetail {
  role: UserRole
  referenceId?: string
  referenceModel?: 'Agent' | 'Maker' | 'Utilisateur'
  caisseId?: string
  dateAttribution: string
  actif: boolean
}

export interface User {
  _id: string
  username: string
  email: string
  rolePrincipal: UserRole
  roles: UserRoleDetail[]
  nom: string
  prenom: string
  telephone: string
  whatsapp?: string
  cni?: string
  profession?: string
  beneficiaires?: Array<{
    nom: string
    prenom: string
    relation: string
    telephone?: string
  }>
  statut: 'actif' | 'inactif' | 'suspendu'
  permissions: string[]
  mustChangePassword?: boolean
  createdAt?: string
  derniereConnexion?: string
  tentativesConnexion?: number
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (user: User, token: string, refreshToken: string) => void
  logout: () => void
  hasRole: (role: UserRole) => boolean
  isMakerInCaisse: (caisseId: string) => boolean
  isUtilisateurInCaisse: (caisseId: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, token, refreshToken) => 
        set({ user, token, refreshToken, isAuthenticated: true }),
      logout: () => 
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false }),
      hasRole: (role: UserRole) => {
        const user = get().user
        if (!user) return false
        return user.rolePrincipal === role || 
               user.roles.some(r => r.role === role && r.actif)
      },
      isMakerInCaisse: (caisseId: string) => {
        const user = get().user
        if (!user) return false
        return user.roles.some(r => 
          r.role === 'MAKER' && r.caisseId === caisseId && r.actif
        )
      },
      isUtilisateurInCaisse: (caisseId: string) => {
        const user = get().user
        if (!user) return false
        return user.roles.some(r => 
          r.role === 'UTILISATEUR' && r.caisseId === caisseId && r.actif
        )
      },
    }),
    {
      name: 'chift-auth',
    }
  )
)
