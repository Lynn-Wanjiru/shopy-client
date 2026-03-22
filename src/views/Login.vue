<template>
  <div :class="darkModeStore.isDarkMode ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <!-- Header -->
        <div class="mb-6 text-center">
          <div class="flex items-center justify-center space-x-1 mb-2">
            <span class="text-3xl">🛍️</span>
            <span class="text-2xl font-bold text-orange-600">Shopy</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-3">
          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              @blur="validateEmail"
              class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
              :class="emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
              placeholder="you@example.com"
            />
            <p v-if="emailError" class="mt-0.5 text-red-600 dark:text-black text-xs">{{ emailError }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errMessage" class="p-2.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-black rounded-lg border border-red-300 dark:border-red-700 text-xs">
            <p class="font-bold">❌ Login Failed</p>
            <p>{{ errMessage }}</p>
            <p v-if="errMessage.includes('Invalid')" class="mt-1 pt-1 border-t border-red-300">
              Don't have an account? <RouterLink to="/register" class="font-bold hover:underline">Register</RouterLink>
            </p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="submitting || !!emailError || !form.email || !form.password"
            class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition text-sm"
          >
            Sign In
          </button>

          <!-- Divider -->
          <div class="relative my-2">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <!-- Google Login Button -->
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full flex items-center justify-center space-x-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-xs"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <!-- Footer Links -->
        <div class="mt-4 text-center space-y-2">
          <router-link
            to="/register"
            class="block text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-bold"
          >
            Create New Account
          </router-link>
          <router-link
            to="/"
            class="block text-xs text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
          >
            ← Back to Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDarkModeStore } from '@/stores/darkMode'

const router = useRouter()
const authStore = useAuthStore()
const darkModeStore = useDarkModeStore()

const form = ref({
  email: '',
  password: ''
})

const submitting = ref(false)
const errMessage = ref('')
const emailError = ref('')

// Email validation
const validateEmail = () => {
  const email = form.value.email
  if (!email) {
    emailError.value = 'Email is required'
  } else if (!/^[^\s@]+@(gmail\.com|icloud\.com|yahoo\.com)$/.test(email)) {
    emailError.value = 'Please use Gmail, iCloud, or Yahoo email'
  } else {
    emailError.value = ''
  }
}

const handleLogin = async () => {
  try {
    // Validate fields
    if (!form.value.email || !form.value.password) {
      errMessage.value = 'Please fill in all fields'
      return
    }

    validateEmail()
    if (emailError.value) return

    submitting.value = true
    errMessage.value = ''

    await authStore.login(form.value.email, form.value.password)

    // Redirect based on role
    if (authStore.isAdmin) {
      router.push('/admin/products')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    errMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    errMessage.value = ''

    const { google } = window as any

    if (!google) {
      errMessage.value = 'Google Sign-In SDK not loaded. Refresh the page.'
      return
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId || clientId === 'your_google_client_id.apps.googleusercontent.com') {
      errMessage.value = 'Google Client ID not configured. Check your .env.local file.'
      return
    }

    // Initialize Google Sign-In
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCallback
    })

    // Create a hidden button and click it
    const hiddenDiv = document.createElement('div')
    hiddenDiv.style.position = 'absolute'
    hiddenDiv.style.left = '-9999px'
    document.body.appendChild(hiddenDiv)

    google.accounts.id.renderButton(hiddenDiv, {
      type: 'standard',
      size: 'large'
    })

    const button = hiddenDiv.querySelector('[role="button"]') as HTMLElement
    if (button) {
      button.click()
      // Reset loading state if popup is closed after 2 seconds with no callback
      setTimeout(() => {
        submitting.value = false
        try {
          document.body.removeChild(hiddenDiv)
        } catch (e) {
          // ignore
        }
      }, 2000)
    } else {
      errMessage.value = 'Could not initialize Google Sign-In'
    }
  } catch (error: any) {
    errMessage.value = 'Google authentication error: ' + error.message
  }
}

const handleGoogleCallback = async (response: any) => {
  try {
    submitting.value = true
    errMessage.value = ''

    if (!response.credential) {
      errMessage.value = 'No token received from Google'
      submitting.value = false
      return
    }

    const idToken = response.credential

    // Use auth store to handle Google login
    await authStore.googleLogin(idToken)

    // Redirect based on role
    if (authStore.user?.role === 'admin') {
      router.push('/admin/products')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    errMessage.value = error.message || 'Google login failed'
    submitting.value = false
  }
}
</script>
