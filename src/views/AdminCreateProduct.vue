<script setup lang="ts">
import { ref } from 'vue'

interface Product {
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
  sku?: string
}

const message = ref<string>('')
const messageType = ref<'success' | 'error'>('success')
const submitting = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const form = ref<Product>({
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: '',
  stock: 0,
  sku: ''
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files[0]) {
    imageFile.value = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(files[0])
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0,
    sku: ''
  }
  imageFile.value = null
  imagePreview.value = ''
  message.value = ''
}

const submitForm = async () => {
  message.value = ''
  
  if (!form.value.name || !form.value.description || !form.value.category) {
    message.value = '⚠️ Please fill in all required fields'
    messageType.value = 'error'
    return
  }

  if (!form.value.imageUrl && !imageFile.value) {
    message.value = '⚠️ Please provide an image URL or upload an image file'
    messageType.value = 'error'
    return
  }
  
  submitting.value = true
  
  try {
    if (imageFile.value) {
      const formData = new FormData()
      formData.append('name', form.value.name)
      formData.append('description', form.value.description)
      formData.append('price', form.value.price.toString())
      formData.append('category', form.value.category)
      formData.append('stock', form.value.stock.toString())
      if (form.value.sku) formData.append('sku', form.value.sku)
      formData.append('image', imageFile.value)

      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (response.ok) {
        message.value = '✅ Product created successfully!'
        messageType.value = 'success'
        resetForm()
        setTimeout(() => { message.value = '' }, 4000)
      } else {
        message.value = '❌ ' + (data.message || 'Error creating product')
        messageType.value = 'error'
      }
    } else {
      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(form.value)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        message.value = '✅ Product created successfully!'
        messageType.value = 'success'
        resetForm()
        setTimeout(() => { message.value = '' }, 4000)
      } else {
        message.value = '❌ ' + (data.message || 'Error creating product')
        messageType.value = 'error'
      }
    }
  } catch (err) {
    console.error('Error creating product:', err)
    message.value = '❌ Error creating product: ' + (err instanceof Error ? err.message : 'Unknown error')
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <!-- Page Header -->
    <h1 class="text-3xl font-bold text-gray-900 mb-6">➕ Create New Product</h1>

    <!-- Message Alert -->
    <div v-if="message" :class="[
      'mb-6 p-4 rounded-lg font-semibold',
      messageType === 'success' 
        ? 'bg-green-100 text-green-800 border border-green-400' 
        : 'bg-red-100 text-red-800 border border-red-400'
    ]">
      {{ message }}
    </div>

    <!-- Create Product Form -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter product name"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <!-- Price -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Price (Ksh) *</label>
          <input
            v-model.number="form.price"
            type="number"
            placeholder="0.00"
            required
            min="0"
            step="0.01"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <!-- Category -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
          <input
            v-model="form.category"
            type="text"
            placeholder="e.g. Clothing, Electronics"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <!-- Stock -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
          <input
            v-model.number="form.stock"
            type="number"
            placeholder="0"
            required
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <!-- SKU -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">SKU (Optional)</label>
          <input
            v-model="form.sku"
            type="text"
            placeholder="e.g. PRODUCT-001"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <!-- Image URL -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
          <input
            v-model="form.imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <!-- Description -->
        <div class="col-span-1 md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          <textarea
            v-model="form.description"
            placeholder="Write a detailed product description"
            required
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <!-- Image Upload Section -->
        <div class="col-span-1 md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Or Upload Image File</label>
          <div class="flex gap-4">
            <label class="flex-1 border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition">
              <input
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
              <div class="text-center">
                <p class="text-blue-600 font-semibold">📤 Upload Image</p>
                <p class="text-sm text-gray-500">or drag & drop</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Image Preview -->
        <div v-if="imagePreview || form.imageUrl" class="col-span-1 md:col-span-2">
          <p class="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
          <img 
            :src="imagePreview || form.imageUrl" 
            :alt="form.name" 
            class="h-48 w-48 object-cover rounded-lg border border-gray-300"
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          />
        </div>
        
        <!-- Buttons -->
        <div class="col-span-1 md:col-span-2 flex gap-4">
          <button
            type="submit"
            :disabled="submitting"
            :class="[
              'flex-1 font-bold py-3 px-4 rounded-lg transition',
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            ]"
          >
            {{ submitting ? '⏳ Creating...' : '✅ Create Product' }}
          </button>
          <button
            type="button"
            @click="resetForm"
            class="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            🗑️ Clear Form
          </button>
        </div>
      </form>
    </div>
  </div>
</template>