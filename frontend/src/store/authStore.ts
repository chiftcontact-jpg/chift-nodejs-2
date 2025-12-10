import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'ADMIN' | 'AGENT' | 'SUPERVISEUR' | 'MAKER' | 'ADHERENT'

export interface UserRoleDetail {
  role: UserRole
  referenceId?: string
  referenceModel?: 'Agent' | 'Maker' | 'Adherent'
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
  isAdherentInCaisse: (caisseId: string) => boolean
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
      isAdherentInCaisse: (caisseId: string) => {
        const user = get().user
        if (!user) return false
        return user.roles.some(r => 
          r.role === 'ADHERENT' && r.caisseId === caisseId && r.actif
        )
      },
    }),
    {
      name: 'chift-auth',
    }
  )
)
