import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
  rating?: number
  sku?: string
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  // Fetch all products
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${apiUrl}/products`)
      products.value = response.data.data || response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  // Get single product by ID
  const getProductById = async (id: string) => {
    try {
      const response = await axios.get(`${apiUrl}/products/${id}`)
      return response.data.data || response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch product'
      console.error('Error fetching product:', err)
      return null
    }
  }

  // Get products by category
  const getProductsByCategory = (category: string) => {
    return products.value.filter(p => p.category === category)
  }

  // Search products
  const searchProducts = (query: string) => {
    return products.value.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
  }
})