/// <reference types="vite/client" />

import { useAuthStore } from '../store/authStore'

// Configuration de l'URL du Gateway
// En production sur Vercel, on utilise VITE_API_URL configuré sur Railway
// En développement local, on utilise le proxy Vite (/api)
const rawUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_GATEWAY_URL || '/api'
const GATEWAY_URL = rawUrl.trim().replace(/\/$/, '')

console.log('🔧 Gateway URL configuré:', GATEWAY_URL)

// Fonction helper pour les requêtes fetch
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const url = `${GATEWAY_URL}${endpoint}`
  console.log('📡 Requête API:', url)

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
    })

    console.log('📬 Réponse status:', response.status)

    // Vérifier si la réponse a du contenu avant de tenter de parser du JSON
    const contentType = response.headers.get('content-type')
    let data: any = null
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (e) {
          console.error('❌ Erreur parsing JSON:', e)
        }
      }
    }

    if (response.status === 401) {
      console.error('❌ 401 Unauthorized:', data)
      useAuthStore.getState().logout()
      window.location.href = '/login'
      throw new Error('Non autorisé')
    }

    console.log('✅ Données reçues:', data)
    
    if (!response.ok) {
      throw new Error(data?.message || `Erreur API (${response.status})`)
    }

    return { data }
  } catch (error: any) {
    console.error('❌ Erreur API:', error)
    throw error
  }
}

// API Authentification (via Gateway)
export const authAPI = {
  // Connexion via le gateway
  login: (email: string, password: string) => {
    console.log('🔐 Tentative de login:', email)
    const payload = { email, password }
    console.log('📦 Payload envoyé:', payload)
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  // Déconnexion
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),

  // Rafraîchir le token
  refreshToken: (refreshToken: string) => 
    fetchAPI('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
}

// API Utilisateur (via Gateway -> User Service)
export const userAPI = {
  // Profil de l'utilisateur connecté
  getProfile: () => fetchAPI('/users/profile'),

  // Récupérer tous les utilisateurs (admin)
  getAll: (filters?: {
    role?: string
    statut?: string
    region?: string
    departement?: string
    commune?: string
    page?: number
    limit?: number
  }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString()
    return fetchAPI(`/users${queryString ? `?${queryString}` : ''}`)
  },

  // Récupérer un utilisateur par ID
  getById: (id: string) => fetchAPI(`/users/${id}`),

  // Créer un utilisateur
  create: (data: {
    username: string
    email: string
    password: string
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
      telephone: string
    }>
    statut?: 'actif' | 'inactif' | 'suspendu'
    permissions?: string[]
  }) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Mettre à jour un utilisateur
  update: (id: string, data: Partial<any>) => 
    fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Supprimer un utilisateur
  delete: (id: string) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),

  // Changer le statut
  changeStatus: (id: string, statut: 'actif' | 'inactif' | 'suspendu') => 
    fetchAPI(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    }),

  // Mettre à jour les permissions
  updatePermissions: (id: string, permissions: string[]) => 
    fetchAPI(`/users/${id}/permissions`, {
      method: 'PATCH',
      body: JSON.stringify({ permissions }),
    }),

  // Changer le mot de passe
  updatePassword: (id: string, data: { currentPassword: string; newPassword: string }) =>
    fetchAPI(`/users/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Récupérer le QR code d'un utilisateur
  getQRCode: (id: string) => fetchAPI(`/users/${id}/qrcode`),

  // Récupérer les statistiques des utilisateurs
  getStatistics: () => fetchAPI('/users/statistics'),

  // Gérer les rôles
  getRoles: (userId: string) => fetchAPI(`/users/${userId}/roles`),
  
  addRole: (userId: string, role: {
    role: UserRole
    caisseId?: string
    referenceId?: string
    referenceModel?: 'Agent' | 'Maker' | 'Utilisateur'
  }) => fetchAPI(`/users/${userId}/roles`, {
    method: 'POST',
    body: JSON.stringify(role),
  }),
  
  removeRole: (userId: string, roleIndex: number) => 
    fetchAPI(`/users/${userId}/roles/${roleIndex}`, { method: 'DELETE' }),
}

// API Comptes et Services (via Gateway -> Comptes Service)
export const comptesAPI = {
  // Récupérer tous les comptes de l'utilisateur
  getAll: () => fetchAPI('/comptes'),
  
  // Récupérer un compte par ID
  getById: (id: string) => fetchAPI(`/comptes/${id}`),
  
  // Créer un compte
  create: (compteData: any) => fetchAPI('/comptes', {
    method: 'POST',
    body: JSON.stringify(compteData),
  }),

  // Mettre à jour le statut d'un compte
  updateStatus: (id: string, statut: string) => fetchAPI(`/comptes/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ statut }),
  }),
}

export const servicesAPI = {
  // Récupérer tous les services de l'utilisateur
  getAll: () => fetchAPI('/comptes/services'),
  
  // Récupérer un service par ID
  getById: (id: string) => fetchAPI(`/comptes/services/${id}`),
  
  // Créer un service
  create: (serviceData: any) => fetchAPI('/comptes/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  }),
}

// Import des types pour l'API
import type { UserRole, UserRoleDetail } from '../store/authStore'

// API Caisse
export const caisseAPI = {
  // Récupérer toutes les caisses
  getAll: (filters?: {
    region?: string;
    departement?: string;
    commune?: string;
    statut?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(filters as any).toString()
    return fetchAPI(`/caisses${params ? `?${params}` : ''}`)
  },

  // Récupérer une caisse par ID
  getById: (id: string) => fetchAPI(`/caisses/${id}`),

  // Créer une caisse
  create: (data: {
    nom: string;
    communaute: string;
    badge: string;
    frequence: string;
    jour: string;
    montantCotisation?: number;
    region: string;
    departement: string;
    commune: string;
    dateCreationPhysique?: string;
    femmesActives?: number;
    hommesActifs?: number;
    echeanceEvenement?: string;
    dateEcheance?: string;
    solidarite?: string;
    tauxInteret?: string;
  }) => fetchAPI('/caisses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Mettre à jour une caisse
  update: (id: string, data: Partial<any>) => fetchAPI(`/caisses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Supprimer une caisse
  delete: (id: string) => fetchAPI(`/caisses/${id}`, { method: 'DELETE' }),

  // Changer le statut d'une caisse
  changeStatus: (id: string, statut: 'active' | 'inactive') => 
    fetchAPI(`/caisses/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    }),

  // Ajouter un maker
  addMaker: (id: string, agentId: string) => 
    fetchAPI(`/caisses/${id}/makers`, {
      method: 'POST',
      body: JSON.stringify({ agentId }),
    }),

  // Retirer un maker
  removeMaker: (id: string, makerId: string) => 
    fetchAPI(`/caisses/${id}/makers/${makerId}`, { method: 'DELETE' })
};

// API Agent
export const agentAPI = {
  // Récupérer tous les agents
  getAll: (filters?: {
    statut?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(filters as any).toString();
    return fetchAPI(`/agents${params ? `?${params}` : ''}`);
  },

  // Récupérer un agent par ID
  getById: (id: string) => fetchAPI(`/agents/${id}`),

  // Créer un agent
  create: (data: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    whatsapp?: string;
    cni?: string;
  }) => fetchAPI('/agents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Export par défaut de fetchAPI pour compatibilité
// Fournit une interface compatible "axios" utilisée par les pages
const api = {
  get: (endpoint: string, options: RequestInit = {}) => fetchAPI(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options: RequestInit = {}) =>
    fetchAPI(endpoint, { ...options, method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined }),
  put: (endpoint: string, data?: any, options: RequestInit = {}) =>
    fetchAPI(endpoint, { ...options, method: 'PUT', body: data !== undefined ? JSON.stringify(data) : undefined }),
  patch: (endpoint: string, data?: any, options: RequestInit = {}) =>
    fetchAPI(endpoint, { ...options, method: 'PATCH', body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: (endpoint: string, data?: any, options: RequestInit = {}) =>
    fetchAPI(endpoint, { ...options, method: 'DELETE', body: data !== undefined ? JSON.stringify(data) : undefined }),
}

export default api
