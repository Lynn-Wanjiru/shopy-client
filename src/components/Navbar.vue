<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center min-w-fit">
          <RouterLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl sm:text-3xl">🛍️</span>
            <span class="text-lg sm:text-2xl font-bold text-orange-600">Shopy</span>
          </RouterLink>
        </div>

        <!-- Center: Search Bar (Hidden on mobile) -->
        <div class="hidden sm:flex flex-1 max-w-2xl mx-4">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
            />
            <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <!-- Right: User Actions -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Shop Now Button (Hidden on small mobile) -->
          <RouterLink
            to="/"
            class="hidden lg:inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition"
          >
            🛍️ Shop Now
          </RouterLink>

          <!-- Wishlist -->
          <button 
            @click="$event.stopPropagation(); router.push('/wishlist')"
            class="relative p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition group"
            title="View Wishlist"
          >
            <span class="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
              {{ authStore.isAuthenticated && wishlistStore.itemCount > 0 ? '❤️' : '🤍' }}
            </span>
            <span v-if="authStore.isAuthenticated && wishlistStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ wishlistStore.itemCount }}
            </span>
          </button>

          <!-- Quick Links Dropdown (Hidden on mobile) -->
          <div class="hidden md:relative">
            <button 
              data-quick-links-btn
              @click="showQuickLinksDropdown = !showQuickLinksDropdown"
              class="p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition text-sm font-medium"
            >
              Quick Links ▼
            </button>
            <div v-if="showQuickLinksDropdown" data-quick-links-menu class="absolute top-12 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-40 z-50">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition">Track Orders</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition">Returns</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition">Help Center</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition">About Us</a>
            </div>
          </div>

          <!-- Cart -->
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/cart"
            class="relative p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition"
          >
            <span class="text-xl sm:text-2xl">🛒</span>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>
          <button
            v-else
            @click="router.push('/login')"
            class="p-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition text-xl sm:text-2xl"
          >
            🛒
          </button>


          <!-- Authenticated User Actions Group -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-1">
            <!-- User Menu Button -->
            <div class="relative">
              <button 
                data-user-menu-btn
                @click="showUserMenuDropdown = !showUserMenuDropdown"
                class="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <div class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                  {{ authStore.user?.firstName?.charAt(0) || '?' }}
                </div>
                <span class="hidden sm:inline text-sm font-medium text-gray-900 dark:text-gray-100">{{ authStore.user?.firstName }}</span>
              </button>

              <!-- User Dropdown Menu -->
              <div v-if="showUserMenuDropdown" data-user-menu-dropdown class="absolute top-12 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-48 z-50">
                <!-- Profile Section -->
                <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p class="text-xs font-semibold text-gray-600 dark:text-gray-200">Account</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-800">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-200">{{ authStore.user?.email }}</p>
                </div>

                <!-- Menu Items -->
                <RouterLink
                  to="/profile"
                  @click="showUserMenuDropdown = false"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition"
                >
                  👤 My Profile
                </RouterLink>
                <RouterLink
                  to="/settings"
                  @click="showUserMenuDropdown = false"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition"
                >
                  ⚙️ Settings
                </RouterLink>
                <RouterLink
                  to="/orders"
                  @click="showUserMenuDropdown = false"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition"
                >
                  🏪 My Orders
                </RouterLink>

                <!-- Admin Section -->
                <div v-if="authStore.isAdmin" class="border-t border-gray-100 dark:border-gray-700">
                  <RouterLink
                    to="/admin/products"
                    @click="showUserMenuDropdown = false"
                    class="block px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 transition m-2 rounded text-center"
                  >
                    ⚙️ Admin Panel
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Logout Button -->
            <button
              @click="authStore.logout()"
              class="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Logout"
            >
              Logout
            </button>

            <!-- Dark Mode Toggle -->
            <button
              @click="darkModeStore.toggle()"
              class="p-2 text-gray-700 dark:text-gray-300 transition"
              :title="darkModeStore.isDarkMode ? 'Light Mode' : 'Dark Mode'"
            >
              <!-- Sun Icon (Light Mode) -->
              <svg v-if="darkModeStore.isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <!-- Moon Icon (Dark Mode) -->
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>

          <!-- Login/Register (when not authenticated) -->
          <div v-else class="flex items-center space-x-1 sm:space-x-2">
            <RouterLink
              to="/login"
              class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 transition"
            >
              Register
            </RouterLink>

            <!-- Dark Mode Toggle -->
            <button
              @click="darkModeStore.toggle()"
              class="p-2 text-gray-700 dark:text-gray-300 transition"
              :title="darkModeStore.isDarkMode ? 'Light Mode' : 'Dark Mode'"
            >
              <!-- Sun Icon (Light Mode) -->
              <svg v-if="darkModeStore.isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <!-- Moon Icon (Dark Mode) -->
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div class="sm:hidden pb-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useDarkModeStore } from '@/stores/darkMode'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const darkModeStore = useDarkModeStore()
const router = useRouter()

const searchQuery = ref('')
const showQuickLinksDropdown = ref(false)
const showUserMenuDropdown = ref(false)

const handleClickOutside = (e: Event) => {
  const target = e.target as HTMLElement
  
  // Check if click is outside Quick Links dropdown
  const quickLinksBtn = document.querySelector('[data-quick-links-btn]')
  const quickLinksMenu = document.querySelector('[data-quick-links-menu]')
  if (quickLinksMenu && !quickLinksMenu.contains(target) && !quickLinksBtn?.contains(target)) {
    showQuickLinksDropdown.value = false
  }
  
  // Check if click is outside User Menu dropdown
  const userMenuBtn = document.querySelector('[data-user-menu-btn]')
  const userMenuDropdown = document.querySelector('[data-user-menu-dropdown]')
  if (userMenuDropdown && !userMenuDropdown.contains(target) && !userMenuBtn?.contains(target)) {
    showUserMenuDropdown.value = false
  }
}

onMounted(() => {
  cartStore.initCart()
  wishlistStore.initWishlist()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
