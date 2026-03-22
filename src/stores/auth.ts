import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Register
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName })
      })

      const data = await response.json()

      if (response.ok) {
        token.value = data.token
        user.value = data.user
        localStorage.setItem('token', data.token)
        return { success: true }
      } else {
        error.value = data.message || 'Registration failed'
        return { success: false, message: data.message }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration error'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Login
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        token.value = data.token
        user.value = data.user
        localStorage.setItem('token', data.token)
        return { success: true }
      } else {
        error.value = data.message || 'Login failed'
        throw new Error(data.message || 'Login failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login error'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get current user
  const getCurrentUser = async () => {
    if (!token.value) return

    isLoading.value = true
    try {
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        user.value = data.user
      } else {
        logout()
      }
    } catch (err) {
      console.error('Error fetching user:', err)
      logout()
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    error.value = null
  }

  // Initialize auth on app load
  const initAuth = async () => {
    if (token.value) {
      await getCurrentUser()
    }
  }

  // Set user (for OAuth flows)
  const setUser = (userData: User) => {
    user.value = userData
  }

  // Google Login/Signup
  const googleLogin = async (idToken: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      })

      const data = await response.json()

      if (response.ok) {
        token.value = data.token
        user.value = data.user
        localStorage.setItem('token', data.token)
        return { success: true, data }
      } else {
        error.value = data.message || 'Google authentication failed'
        throw new Error(data.message || 'Google authentication failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google authentication error'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Alias for signup (same endpoint)
  const googleSignup = googleLogin

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    getCurrentUser,
    initAuth,
    setUser,
    googleLogin,
    googleSignup
  }
})