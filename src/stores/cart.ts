import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const loading = ref(false)

  // Load cart from localStorage
  const initCart = () => {
    try {
      const saved = localStorage.getItem('shopy_cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Filter out invalid items (items must have all required properties)
        items.value = parsed.filter((item: any) => 
          item._id && item.name && item.price !== undefined && item.quantity && item.imageUrl
        )
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      items.value = []
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    try {
      // Save items without strict validation - just ensure required fields
      const itemsToSave = items.value.filter(item => 
        item._id && item.name && item.price !== undefined && item.quantity > 0
      ).map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl || '' // Allow empty imageUrl instead of filtering it out
      }))
      localStorage.setItem('shopy_cart', JSON.stringify(itemsToSave))
      console.log('Cart saved:', itemsToSave)
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }

  // Add item to cart
  const addToCart = (product: any) => {
    if (!product || !product._id) {
      console.error('Invalid product - missing _id')
      return false
    }
    
    console.log('Adding to cart:', product)
    const existingItem = items.value.find(item => item._id === product._id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        _id: product._id,
        name: product.name || 'Unnamed Product',
        price: product.price || 0,
        quantity: 1,
        imageUrl: product.imageUrl || ''
      })
    }
    saveCart()
    return true
  }

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    items.value = items.value.filter(item => item._id !== productId)
    saveCart()
  }

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find(i => i._id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  // Clear cart
  const clearCart = () => {
    items.value = []
    localStorage.removeItem('shopy_cart')
  }

  // Computed properties
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const tax = computed(() => {
    return subtotal.value * 0.16 // 16% VAT
  })

  const total = computed(() => {
    return subtotal.value + tax.value
  })

  return {
    items,
    loading,
    itemCount,
    subtotal,
    tax,
    total,
    initCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})
