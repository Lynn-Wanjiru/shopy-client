import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface WishlistItem {
  _id: string
  name: string
  price: number
  imageUrl: string
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])

  // Load wishlist from localStorage
  const initWishlist = () => {
    try {
      const saved = localStorage.getItem('shopy_wishlist')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Filter out invalid items (items must have all required properties)
        items.value = parsed.filter((item: any) => 
          item._id && item.name && item.price !== undefined && item.imageUrl
        )
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
      items.value = []
    }
  }

  // Save wishlist to localStorage
  const saveWishlist = () => {
    try {
      // Only save valid items
      const validItems = items.value.filter(item => 
        item._id && item.name && item.price !== undefined && item.imageUrl
      )
      localStorage.setItem('shopy_wishlist', JSON.stringify(validItems))
    } catch (error) {
      console.error('Error saving wishlist:', error)
    }
  }

  // Add item to wishlist
  const addToWishlist = (product: any) => {
    const existingItem = items.value.find(item => item._id === product._id)
    
    if (!existingItem) {
      items.value.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      })
      saveWishlist()
    }
  }

  // Remove item from wishlist
  const removeFromWishlist = (productId: string) => {
    items.value = items.value.filter(item => item._id !== productId)
    saveWishlist()
  }

  // Toggle item in wishlist
  const toggleWishlist = (product: any) => {
    const existingItem = items.value.find(item => item._id === product._id)
    
    if (existingItem) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  // Check if item is in wishlist
  const isInWishlist = (productId: string) => {
    return items.value.some(item => item._id === productId)
  }

  // Clear wishlist
  const clearWishlist = () => {
    items.value = []
    localStorage.removeItem('shopy_wishlist')
  }

  // Computed properties
  const itemCount = computed(() => {
    return items.value.length
  })

  return {
    items,
    itemCount,
    initWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist
  }
})
