<template>
  <div :class="darkModeStore.isDarkMode ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Header -->
    <div class="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold">My Wishlist</h1>
          <p class="mt-2 text-orange-100">Your saved favorites</p>
        </div>
        <RouterLink
          to="/"
          class="px-6 py-2 bg-white dark:bg-gray-700 text-orange-600 dark:text-gray-800 font-bold rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-600 shadow-lg"
        >
          ← Back to Shopping
        </RouterLink>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Empty Wishlist -->
      <div v-if="wishlistStore.items.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <p class="text-6xl mb-4">🤍</p>
        <p class="text-2xl text-gray-600 dark:text-gray-400 mb-4">Your wishlist is empty</p>
        <p class="text-gray-500 dark:text-gray-500 mb-6">Add products to your wishlist by clicking the heart icon!</p>
        <router-link
          to="/"
          class="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-8 rounded-lg transition"
        >
          Browse Products
        </router-link>
      </div>

      <!-- Wishlist Items Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in wishlistStore.items"
          :key="item._id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <!-- Product Image -->
          <div class="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden group">
            <img
              :src="item.imageUrl"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            <!-- Remove from Wishlist Button (Overlay) -->
            <button
              @click="wishlistStore.removeFromWishlist(item._id)"
              class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition opacity-0 group-hover:opacity-100"
              title="Remove from Wishlist"
            >
              <span class="text-lg">✕</span>
            </button>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{{ item.name }}</h3>
            
            <!-- Price -->
            <div class="mb-4">
              <p class="text-2xl font-bold text-orange-600">
                KES {{ item.price.toLocaleString() }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <!-- Add to Cart Button -->
              <button
                @click="addToCart(item)"
                class="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition text-sm"
              >
                🛒 Add to Cart
              </button>
              
              <!-- Remove Button -->
              <button
                @click="wishlistStore.removeFromWishlist(item._id)"
                class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-lg transition text-sm"
                title="Remove from Wishlist"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Clear Wishlist Button (if there are items) -->
      <div v-if="wishlistStore.items.length > 0" class="mt-8 text-center">
        <button
          @click="wishlistStore.clearWishlist"
          class="px-6 py-3 border-2 border-gray-300 hover:border-red-600 text-gray-700 hover:text-red-600 font-bold rounded-lg transition"
        >
          Clear Wishlist
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { useDarkModeStore } from '@/stores/darkMode'
import { RouterLink } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const darkModeStore = useDarkModeStore()

// Initialize wishlist when component mounts
wishlistStore.initWishlist()

// Add item to cart from wishlist
const addToCart = (item: any) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  cartStore.addToCart(item)
  alert('✅ Added to cart!')
}
</script>
