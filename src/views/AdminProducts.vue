<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Product {
  _id?: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
  sku?: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const message = ref<string>('')
const messageType = ref<'success' | 'error'>('success')

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

onMounted(async () => {
  await loadProducts()
})

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await fetch(`${apiUrl}/products`)
    const data = await response.json()
    products.value = data.data || data
  } catch (err) {
    console.error('Error loading products:', err)
    message.value = 'Error loading products'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const deleteProduct = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await fetch(`${apiUrl}/products/${id}`, { 
        method: 'DELETE' 
      })
      
      if (response.ok) {
        message.value = '✅ Product deleted successfully'
        messageType.value = 'success'
        await loadProducts()
        setTimeout(() => { message.value = '' }, 3000)
      } else {
        message.value = '❌ Error deleting product'
        messageType.value = 'error'
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      message.value = '❌ Error deleting product'
      messageType.value = 'error'
    }
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Page Header -->
    <h1 class="text-3xl font-bold text-gray-900 mb-6">📦 Inventory</h1>

    <!-- Message Alert -->
    <div v-if="message" :class="[
      'mb-6 p-4 rounded-lg font-semibold',
      messageType === 'success' 
        ? 'bg-green-100 text-green-800 border border-green-400' 
        : 'bg-red-100 text-red-800 border border-red-400'
    ]">
      {{ message }}
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500 text-lg">⏳ Loading products...</p>
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left font-bold">Name</th>
            <th class="px-6 py-3 text-left font-bold">Price</th>
            <th class="px-6 py-3 text-left font-bold">Category</th>
            <th class="px-6 py-3 text-left font-bold">Stock</th>
            <th class="px-6 py-3 text-left font-bold">SKU</th>
            <th class="px-6 py-3 text-left font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id" class="border-b hover:bg-gray-50 transition">
            <td class="px-6 py-4 font-medium">{{ product.name }}</td>
            <td class="px-6 py-4">Ksh {{ product.price.toLocaleString() }}</td>
            <td class="px-6 py-4">{{ product.category }}</td>
            <td class="px-6 py-4">
              <span :class="[
                'px-3 py-1 rounded font-semibold',
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              ]">
                {{ product.stock }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">{{ product.sku || '-' }}</td>
            <td class="px-6 py-4">
              <button
                @click="deleteProduct(product._id || '')"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
              >
                🗑️ Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="!loading && products.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">📭 No products yet. <RouterLink to="/admin/create-product" class="text-blue-600 font-semibold hover:underline">Create one now!</RouterLink></p>
      </div>
    </div>
  </div>
</template>