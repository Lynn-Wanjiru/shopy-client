<template>
  <div :class="darkModeStore.isDarkMode ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Header -->
    <div class="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold">Checkout</h1>
          <p class="mt-2 text-orange-100">Complete your purchase</p>
        </div>
        <RouterLink
          to="/"
          class="px-6 py-2 bg-white dark:bg-gray-700 text-black dark:text-black font-bold rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-600 shadow-lg"
        >
          ← Back to Shopping
        </RouterLink>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Delivery Information</h2>

            <!-- Form -->
            <form @submit.prevent="handleCheckout" class="space-y-6">
              <!-- Full Name -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="254712345678"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Format: 254712345678 (with country code)</p>
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Address</label>
                <input
                  v-model="form.address"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <!-- City & Postal Code -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">City</label>
                  <input
                    v-model="form.city"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Postal Code</label>
                  <input
                    v-model="form.postalCode"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <!-- Messages -->
              <div v-if="errMessage" class="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-black rounded-lg border border-red-300 dark:border-red-700">
                <p class="font-bold">❌ Error</p>
                <p>{{ errMessage }}</p>
              </div>

              <div v-if="successMessage" class="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg border border-green-300 dark:border-green-700">
                <p class="font-bold">✅ Success</p>
                <p>{{ successMessage }}</p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="submitting"
                class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition text-lg"
              >
                {{ submitting ? '⏳ Processing Payment...' : `Pay KES ${cartStore.total.toLocaleString()}` }}
              </button>
            </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit sticky top-20">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

          <!-- Items -->
          <div class="space-y-3 mb-6 pb-6 border-b dark:border-gray-700 max-h-64 overflow-y-auto">
            <div
              v-for="item in cartStore.items"
              :key="item._id"
              class="flex justify-between text-sm"
            >
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-200">Qty: {{ item.quantity }}</p>
              </div>
              <p class="font-bold text-orange-600 dark:text-orange-400">KES {{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>

          <!-- Totals -->
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-700 dark:text-gray-100">
              <span>Subtotal</span>
              <span>KES {{ cartStore.subtotal.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-gray-700 dark:text-gray-100">
              <span>Tax (16%)</span>
              <span>KES {{ cartStore.tax.toLocaleString() }}</span>
            </div>
            <div class="border-t dark:border-gray-700 pt-3 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span class="text-orange-600">KES {{ cartStore.total.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="p-4 bg-orange-50 dark:bg-orange-900 rounded-lg border border-orange-200 dark:border-orange-700">
            <p class="text-sm font-bold text-orange-900 dark:text-orange-100 mb-2">💳 Payment Method</p>
            <p class="text-sm text-orange-800 dark:text-orange-200">M-Pesa (STK Push)</p>
            <p class="text-xs text-orange-700 dark:text-orange-300 mt-2">You'll receive a payment prompt on your phone.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useDarkModeStore } from '@/stores/darkMode'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const darkModeStore = useDarkModeStore()

const form = ref({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  phone: '',
  address: '',
  city: '',
  postalCode: ''
})

const submitting = ref(false)
const errMessage = ref('')
const successMessage = ref('')

const handleCheckout = async () => {
  try {
    submitting.value = true
    errMessage.value = ''
    successMessage.value = ''

    // Validate phone number format
    if (!form.value.phone.startsWith('254')) {
      throw new Error('Phone number must start with 254')
    }

    if (form.value.phone.length !== 12) {
      throw new Error('Phone number must be 12 digits')
    }

    if (cartStore.items.length === 0) {
      throw new Error('Your cart is empty')
    }

    // Call backend to initiate M-Pesa payment
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${apiUrl}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: form.value.phone,
        amount: cartStore.total,
        items: cartStore.items,
        deliveryInfo: {
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          email: form.value.email,
          phone: form.value.phone,
          address: form.value.address,
          city: form.value.city,
          postalCode: form.value.postalCode
        }
      })
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to initiate payment')
    }

    // Successfully initiated payment
    successMessage.value = '✅ Payment prompt sent! Check your phone for the M-Pesa popup.'
    
    // Store order ID for reference
    const orderId = data.orderId
    const checkoutRequestId = data.checkoutRequestId

    // Wait a bit and then show success message
    setTimeout(() => {
      successMessage.value = '✅ Order created! You will be notified once payment is confirmed.'
      
      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        cartStore.clearCart()
        router.push('/orders')
      }, 3000)
    }, 2000)

  } catch (error: any) {
    errMessage.value = error.message || 'Payment failed. Please try again.'
    console.error('Checkout error:', error)
  } finally {
    submitting.value = false
  }
}

// Initialize cart on mount
cartStore.initCart()
</script>
