<template>
  <div :class="darkModeStore.isDarkMode ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Content -->
    <div class="py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Profile Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <!-- Header -->
          <div class="mb-8 pb-6 border-b dark:border-gray-700">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-2xl">
                {{ authStore.user?.firstName?.charAt(0) || '?' }}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">Member since 2026</p>
              </div>
            </div>
          </div>

          <!-- Personal Information Section -->
          <div class="mb-8 pb-6 border-b dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">First Name</p>
                <p class="text-lg text-gray-900 dark:text-white">{{ authStore.user?.firstName }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Last Name</p>
                <p class="text-lg text-gray-900 dark:text-white">{{ authStore.user?.lastName }}</p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
                <p class="text-lg text-gray-900 dark:text-white break-all">{{ authStore.user?.email }}</p>
              </div>
            </div>
          </div>

          <!-- Billing Information Section -->
          <div class="mb-8 pb-6 border-b dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Billing Information</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Phone Number</p>
                <p class="text-lg text-gray-900 dark:text-white">
                  Not yet added
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">City</p>
                <p class="text-lg text-gray-900 dark:text-white">
                  Not yet added
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Postal Code</p>
                <p class="text-lg text-gray-900 dark:text-white">
                  Not yet added
                </p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                <p class="text-lg text-gray-900 dark:text-white">
                  Not yet added
                </p>
              </div>
            </div>
          </div>

          <!-- Account Status -->
          <div class="mb-8 pb-6 border-b dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Status</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-700 dark:text-gray-300">Account Status</span>
                <span class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-semibold rounded-full">
                  ✓ Active
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700 dark:text-gray-300">Email Verified</span>
                <span class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-semibold rounded-full">
                  ✓ Verified
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700 dark:text-gray-300">Account Type</span>
                <span v-if="authStore.user?.role === 'admin'" class="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs font-semibold rounded-full">
                  👑 Admin
                </span>
                <span v-else class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold rounded-full">
                  👤 Customer
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <RouterLink
              to="/settings"
              class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded transition text-sm"
            >
              ✏️ Edit Profile
            </RouterLink>
            <button
              @click="goBack"
              class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold rounded transition text-sm"
            >
              ← Back to Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'
import { useDarkModeStore } from '@/stores/darkMode'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const darkModeStore = useDarkModeStore()
const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>
