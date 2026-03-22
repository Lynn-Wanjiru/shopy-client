<template>
  <div :class="darkModeStore.isDarkMode ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Header -->
    <div class="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold">Shopping Cart</h1>
          <p class="mt-2 text-orange-100">Review your items before checkout</p>
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
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <!-- Empty Cart -->
          <div v-if="cartStore.items.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p class="text-6xl mb-4">🛒</p>
            <p class="text-2xl text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</p>
            <p class="text-gray-500 dark:text-gray-500 mb-6">Add some products to get started!</p>
            <router-link
              to="/"
              class="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-8 rounded-lg transition"
            >
              Continue Shopping
            </router-link>
          </div>

          <!-- Cart Items -->
          <div v-else class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item._id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex gap-4"
            >
              <!-- Product Image -->
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="w-24 h-24 object-cover rounded-lg"
              />

              <!-- Product Details -->
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ item.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-100 mb-3">Price: <span class="text-orange-600 font-bold">KES {{ item.price.toLocaleString() }}</span></p>
              </div>

              <!-- Quantity & Actions -->
              <div class="flex flex-col items-end justify-between">
                <!-- Remove Button -->
                <button
                  @click="cartStore.removeFromCart(item._id)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium mb-2"
                >
                  🗑️ Remove
                </button>

                <!-- Quantity Controls -->
                <div class="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <button
                    @click="cartStore.updateQuantity(item._id, item.quantity - 1)"
                    class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 font-bold text-gray-900 dark:text-white"
                  >
                    −
                  </button>
                  <span class="px-3 py-1 font-bold text-gray-900 dark:text-white">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item._id, item.quantity + 1)"
                    class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 font-bold text-gray-900 dark:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Item Subtotal -->
              <div class="text-right min-w-fit">
                <p class="text-sm text-gray-600 dark:text-gray-200 mb-1">Subtotal</p>
                <p class="text-xl font-bold text-orange-600">
                  KES {{ (item.price * item.quantity).toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div v-if="cartStore.items.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit sticky top-20">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

          <!-- Breakdown -->
          <div class="space-y-4 mb-6 pb-6 border-b dark:border-gray-700">
            <div class="flex justify-between text-gray-700 dark:text-gray-100">
              <span class="font-medium">Subtotal</span>
              <span>KES {{ cartStore.subtotal.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-gray-700 dark:text-gray-100">
              <span class="font-medium">Tax (16% VAT)</span>
              <span>KES {{ cartStore.tax.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between text-2xl font-bold text-gray-900 dark:text-white mb-6">
            <span>Total</span>
            <span class="text-orange-600">KES {{ cartStore.total.toLocaleString() }}</span>
          </div>

          <!-- Checkout Button -->
          <router-link
            to="/checkout"
            class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg text-center block transition mb-3"
          >
            Proceed to Checkout
          </router-link>

          <!-- Clear Cart Button -->
          <button
            @click="cartStore.clearCart"
            class="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-red-600 text-gray-700 dark:text-gray-400 dark:hover:text-red-400 hover:text-red-600 font-bold py-2 rounded-lg transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useCartStore } from '@/stores/cart'
import { useDarkModeStore } from '@/stores/darkMode'
import { RouterLink } from 'vue-router'
import { onMounted } from 'vue'

const cartStore = useCartStore()
const darkModeStore = useDarkModeStore()

// Initialize cart when component mounts to load from localStorage
onMounted(() => {
  cartStore.initCart()
})
</script>
