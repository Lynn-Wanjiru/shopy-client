<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDarkModeStore } from '@/stores/darkMode'
import { useRouter } from 'vue-router'

interface OrderItem {
  _id: string
  name: string
  quantity: number
  price: number
  imageUrl: string
}

interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  deliveryDate?: string
}

const authStore = useAuthStore()
const darkModeStore = useDarkModeStore()
const router = useRouter()

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref('')

// Redirect if not authenticated
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Fetch orders from backend API
  loading.value = true
  error.value = ''
  orders.value = []
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${apiUrl}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      // If 404 or no orders, just show empty state
      orders.value = []
      return
    }

    const data = await response.json()
    orders.value = Array.isArray(data) ? data : data.orders || []
  } catch (err) {
    // On error, show empty state instead of error message
    // User will see "No orders yet" which is more friendly
    orders.value = []
  } finally {
    loading.value = false
  }
})

// Watch for logout - redirect if user logs out
watch(() => authStore.isAuthenticated, (newValue) => {
  if (!newValue) {
    router.push('/login')
  }
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
    case 'processing':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
    case 'shipped':
      return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
    case 'delivered':
      return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
    case 'cancelled':
      return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-black'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return '⏳'
    case 'processing':
      return '⚙️'
    case 'shipped':
      return '🚚'
    case 'delivered':
      return '✅'
    case 'cancelled':
      return '❌'
    default:
      return '📦'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Processing'
    case 'shipped':
      return 'Shipped'
    case 'delivered':
      return 'Delivered'
    case 'cancelled':
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getOrderProgress = (status: string) => {
  const stages = ['pending', 'processing', 'shipped', 'delivered']
  return Math.min((stages.indexOf(status) + 1) * 25, 100)
}

// Retry loading orders
const retryLoadOrders = async () => {
  loading.value = true
  error.value = ''
  orders.value = []
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${apiUrl}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      orders.value = []
      return
    }

    const data = await response.json()
    orders.value = Array.isArray(data) ? data : data.orders || []
  } catch (err) {
    orders.value = []
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="darkModeStore.isDarkMode ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Header -->
    <div class="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold">My Orders</h1>
          <p class="mt-2 text-orange-100">Track your order status and delivery</p>
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
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading your orders...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 dark:bg-red-900 text-red-700 dark:text-black rounded-lg shadow p-6 border border-red-300 dark:border-red-700">
        <p class="font-bold text-lg mb-2">❌ Error Loading Orders</p>
        <p>{{ error }}</p>
        <button
          @click="retryLoadOrders"
          class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <p class="text-6xl mb-4">📭</p>
        <p class="text-2xl text-gray-600 dark:text-gray-400 mb-4">You have no orders yet</p>
        <p class="text-gray-500 dark:text-gray-500 mb-6">Start shopping to place your first order!</p>
        <router-link
          to="/"
          class="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-8 rounded-lg transition"
        >
          Continue Shopping
        </router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order._id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <!-- Order Header -->
          <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p class="text-sm font-bold text-gray-600 dark:text-gray-300">Order Number</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ order.orderNumber }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-600 dark:text-gray-300">Order Date</p>
                <p class="text-lg text-gray-900 dark:text-white">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-600 dark:text-gray-300">Total Amount</p>
                <p class="text-lg font-bold text-orange-600">KES {{ order.totalAmount.toLocaleString() }}</p>
              </div>
              <div>
                <span :class="['px-4 py-2 rounded-full text-sm font-bold', getStatusColor(order.status)]">
                  {{ getStatusIcon(order.status) }} {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <p class="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4">Items</p>
            <div class="space-y-3">
              <div v-for="item in order.items" :key="item._id" class="flex gap-4">
                <img
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Qty: {{ item.quantity }}</p>
                  <p class="text-sm font-bold text-orange-600">KES {{ item.price.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Progress/Journey -->
          <div class="px-6 py-6">
            <p class="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4">Delivery Journey</p>

            <!-- Progress Bar -->
            <div class="mb-6">
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-orange-600 h-full transition-all duration-500"
                  :style="{ width: getOrderProgress(order.status) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <!-- Pending -->
              <div class="text-center">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold',
                    ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order.status)
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  1
                </div>
                <p class="text-xs font-bold text-gray-700 dark:text-gray-300">Order Placed</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(order.createdAt) }}</p>
              </div>

              <!-- Processing -->
              <div class="text-center">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold',
                    ['processing', 'shipped', 'delivered'].includes(order.status)
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  2
                </div>
                <p class="text-xs font-bold text-gray-700 dark:text-gray-300">Processing</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">In progress...</p>
              </div>

              <!-- Shipped -->
              <div class="text-center">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold',
                    ['shipped', 'delivered'].includes(order.status)
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  3
                </div>
                <p class="text-xs font-bold text-gray-700 dark:text-gray-300">Shipped</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">On the way...</p>
              </div>

              <!-- Delivered -->
              <div class="text-center">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold',
                    order.status === 'delivered'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  ✓
                </div>
                <p class="text-xs font-bold text-gray-700 dark:text-gray-300">Delivered</p>
                <p v-if="order.status === 'delivered'" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(order.deliveryDate || new Date().toISOString()) }}
                </p>
                <p v-else class="text-xs text-gray-500 dark:text-gray-400">Pending...</p>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition text-sm font-medium">
              📋 View Details
            </button>
            <button class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition text-sm font-medium">
              📞 Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
