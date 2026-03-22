<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkMode'

const authStore = useAuthStore()
const router = useRouter()
const darkModeStore = useDarkModeStore()

const form = ref({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  // Billing Info
  billingAddress: '',
  billingCity: '',
  billingPostalCode: '',
  billingPhone: ''
})

const loading = ref(false)
const message = ref('')
const errorMessage = ref('')
const firstNameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const passwordError = ref('')

// Name validation
const validateFirstName = () => {
  const name = form.value.firstName.trim()
  if (!name) {
    firstNameError.value = 'First name is required'
  } else if (name.length < 2) {
    firstNameError.value = 'First name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    firstNameError.value = 'First name can only contain letters, spaces, and hyphens'
  } else {
    firstNameError.value = ''
  }
}

const validateLastName = () => {
  const name = form.value.lastName.trim()
  if (!name) {
    lastNameError.value = 'Last name is required'
  } else if (name.length < 2) {
    lastNameError.value = 'Last name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    lastNameError.value = 'Last name can only contain letters, spaces, and hyphens'
  } else {
    lastNameError.value = ''
  }
}

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

// Password validation
const validatePassword = () => {
  const password = form.value.newPassword
  if (password && password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
  } else if (password && !/\d/.test(password)) {
    passwordError.value = 'Password must contain at least one number'
  } else if (password && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    passwordError.value = 'Password must contain a special character (!@#$%^&* etc)'
  } else {
    passwordError.value = ''
  }
}

const updateProfile = async () => {
  try {
    // Validate all fields
    validateFirstName()
    validateLastName()
    validateEmail()

    if (firstNameError.value || lastNameError.value || emailError.value) {
      errorMessage.value = 'Please fix the errors above'
      return
    }

    // Validate password if changing it
    if (form.value.newPassword) {
      validatePassword()
      if (passwordError.value) return

      if (form.value.newPassword !== form.value.confirmPassword) {
        errorMessage.value = 'Passwords do not match'
        return
      }

      if (!form.value.currentPassword) {
        errorMessage.value = 'Current password required to change password'
        return
      }
    }

    loading.value = true
    errorMessage.value = ''
    message.value = ''

    // TODO: Send update to backend API
    // For now, just show success message
    message.value = '✅ Profile updated successfully!'
    
    // Reset password fields
    form.value.currentPassword = ''
    form.value.newPassword = ''
    form.value.confirmPassword = ''

    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div :class="darkModeStore.isDarkMode ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Content -->
    <div class="py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Page Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Update your profile information and security settings</p>
          </div>

          <!-- Messages -->
          <div v-if="message" class="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg text-sm">
            {{ message }}
          </div>
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-black rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Form -->
          <form @submit.prevent="updateProfile" class="space-y-4">
            <!-- Personal Info Section -->
            <div class="border-b dark:border-gray-700 pb-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- First Name -->
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    @input="validateFirstName"
                    class="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                    :class="firstNameError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                    placeholder="John"
                  />
                  <p v-if="firstNameError" class="mt-1 text-red-600 dark:text-black text-xs">{{ firstNameError }}</p>
                </div>

                <!-- Last Name -->
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    @input="validateLastName"
                    class="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                    :class="lastNameError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                    placeholder="Doe"
                  />
                  <p v-if="lastNameError" class="mt-1 text-red-600 dark:text-black text-xs">{{ lastNameError }}</p>
                </div>
              </div>

              <!-- Email -->
              <div class="mt-4">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  v-model="form.email"
                  type="email"
                  @blur="validateEmail"
                  class="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  :class="emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                  placeholder="you@example.com"
                />
                <p v-if="emailError" class="mt-1 text-red-600 dark:text-black text-xs">{{ emailError }}</p>
              </div>
            </div>

            <!-- Billing Information Section -->
            <div class="border-b dark:border-gray-700 pb-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Billing Information</h2>

              <!-- Phone Number -->
              <div class="mb-4">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  v-model="form.billingPhone"
                  type="tel"
                  placeholder="254712345678"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <!-- Address -->
              <div class="mb-4">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Billing Address</label>
                <input
                  v-model="form.billingAddress"
                  type="text"
                  placeholder="Street Address"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <!-- City & Postal Code -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    v-model="form.billingCity"
                    type="text"
                    placeholder="Nairobi"
                    class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                  <input
                    v-model="form.billingPostalCode"
                    type="text"
                    placeholder="00100"
                    class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <!-- Security Section -->
            <div class="pb-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Password</h2>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-4">Leave blank if you don't want to change your password</p>

              <!-- Current Password -->
              <div class="mb-4">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input
                  v-model="form.currentPassword"
                  type="password"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>

              <!-- New Password -->
              <div class="mb-4">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input
                  v-model="form.newPassword"
                  type="password"
                  @input="validatePassword"
                  class="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  :class="passwordError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                  placeholder="••••••••"
                />
                <p v-if="passwordError" class="mt-1 text-red-600 dark:text-black text-xs">{{ passwordError }}</p>
                <p v-else-if="form.newPassword" class="mt-1 text-gray-500 dark:text-gray-400 text-xs">6+ chars, 1 number, 1 special char</p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <!-- Save Button -->
            <div class="flex items-center space-x-3">
              <button
                type="submit"
                :disabled="loading || !!firstNameError || !!lastNameError || !!emailError || !!passwordError"
                class="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold rounded transition text-sm"
              >
                {{ loading ? '⏳ Saving...' : '💾 Save Changes' }}
              </button>
              <RouterLink
                to="/profile"
                class="px-6 py-2 border border-gray-300 text-gray-700 dark:text-white dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold rounded transition text-sm inline-block"
              >
                👤 View Profile
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
