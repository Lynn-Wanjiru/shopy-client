<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useDarkModeStore } from '@/stores/darkMode'

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

const productStore = useProductStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const darkModeStore = useDarkModeStore()
const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedProduct = ref<Product | null>(null)
const showModal = ref(false)
const currentSlideIndex = ref(0)
let carouselInterval: ReturnType<typeof setInterval> | null = null

const filteredProducts = computed(() => {
  let products = productStore.products
  
  if (searchQuery.value) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }
  
  return products
})

const categories = computed(() => {
  return [...new Set(productStore.products.map((p: Product) => p.category))] as string[]
})

// Hero Carousel with Model Images
interface HeroSlide {
  id: number
  title: string
  description: string
  imageUrl: string
  tagline: string
  cta: string
}

const heroSlides = ref<HeroSlide[]>([
  {
    id: 1,
    title: "Summer Collection",
    description: "Trendy outfits for the modern fashionista",
    imageUrl: "https://i.pinimg.com/736x/84/f8/61/84f86116a7f7843169a86bc136682994.jpg",
    tagline: "✨ Effortless Style",
    cta: "Shop Summer 2026"
  },
  {
    id: 2,
    title: "Premium Footwear",
    description: "Walk in confidence with our exclusive shoe range",
    imageUrl: "https://i.pinimg.com/1200x/e7/e9/ee/e7e9ee9788640636b5de714a97d52a5b.jpg",
    tagline: "👟 Step Into Style",
    cta: "Explore Shoes"
  },
  {
    id: 3,
    title: "Casual Chic",
    description: "Comfortable yet stylish everyday wear",
    imageUrl: "https://i.pinimg.com/736x/cd/e0/ba/cde0ba4535e831882a0b0de9a564ecfc.jpg",
    tagline: "🎯 Always on Trend",
    cta: "View Collection"
  },
  {
    id: 4,
    title: "Evening Elegance",
    description: "Stunning pieces for special occasions",
    imageUrl: "https://i.pinimg.com/736x/28/c6/85/28c6853dde68fd01ac0f11b71593bc89.jpg",
    tagline: "💎 Dress to Impress",
    cta: "Shop Formal Wear"
  },
  {
    id: 5,
    title: "Urban Fashion",
    description: "Bold designs for the city style",
    imageUrl: "https://i.pinimg.com/1200x/d9/c8/18/d9c818e78a42d34d1bcc64477c6b1010.jpg",
    tagline: "🌟 Own Your Look",
    cta: "Discover Urban Vibes"
  }
])

const currentHeroSlideIndex = ref(0)

const getCurrentHeroSlide = computed(() => {
  return (heroSlides.value && heroSlides.value.length > 0 && heroSlides.value[currentHeroSlideIndex.value]) 
    || (heroSlides.value && heroSlides.value[0])
    || { id: 0, title: "Loading...", description: "", imageUrl: "", tagline: "", cta: "" }
})

const nextHeroSlide = () => {
  currentHeroSlideIndex.value = (currentHeroSlideIndex.value + 1) % heroSlides.value.length
}

const prevHeroSlide = () => {
  currentHeroSlideIndex.value = (currentHeroSlideIndex.value - 1 + heroSlides.value.length) % heroSlides.value.length
}

const goToHeroSlide = (index: number) => {
  currentHeroSlideIndex.value = index
}

let heroCarouselInterval: ReturnType<typeof setInterval> | null = null

const openProductDetail = (product: Product) => {
  selectedProduct.value = product
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

const handleAddToCart = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  if (!selectedProduct.value) return
  
  console.log('Adding product to cart:', selectedProduct.value)
  
  // Add product to cart
  const success = cartStore.addToCart(selectedProduct.value)
  
  if (success) {
    closeModal()
    // Show success message and redirect to cart
    alert('✅ Added to cart! Redirecting...')
    router.push('/cart')
  } else {
    alert('❌ Failed to add product to cart')
  }
}

const handleBuyNow = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  if (!selectedProduct.value) return
  // Clear cart and add only this product
  cartStore.clearCart()
  cartStore.addToCart(selectedProduct.value)
  closeModal()
  // Redirect to checkout
  router.push('/checkout')
}

const handleQuickAddToCart = (e: Event, product: Product) => {
  e.stopPropagation()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  cartStore.addToCart(product)
  alert('✅ Added to cart!')
}

const handleToggleWishlist = (e: Event, product: Product) => {
  e.stopPropagation()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  wishlistStore.toggleWishlist(product)
}

const featuredProducts = computed(() => {
  return productStore.products.slice(0, 5).length > 0 
    ? productStore.products.slice(0, 5) 
    : productStore.products
})

const getCurrentSlide = computed(() => {
  return featuredProducts.value[currentSlideIndex.value] || null
})

const nextSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % featuredProducts.value.length
}

const prevSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value - 1 + featuredProducts.value.length) % featuredProducts.value.length
}

const goToSlide = (index: number) => {
  currentSlideIndex.value = index
}

onMounted(() => {
  productStore.fetchProducts()
  authStore.initAuth()
  cartStore.initCart()
  wishlistStore.initWishlist()
  
  // Start featured products carousel auto-advance
  if (carouselInterval) clearInterval(carouselInterval)
  carouselInterval = setInterval(() => {
    nextSlide()
  }, 5000)
  
  // Start hero carousel auto-advance
  if (heroCarouselInterval) clearInterval(heroCarouselInterval)
  heroCarouselInterval = setInterval(() => {
    nextHeroSlide()
  }, 6000)
})

// Clean up interval on unmount
onBeforeUnmount(() => {
  if (carouselInterval) clearInterval(carouselInterval)
  if (heroCarouselInterval) clearInterval(heroCarouselInterval)
})
</script>

<template>
  <div :class="darkModeStore.isDarkMode ? 'dark' : ''" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Hero Section with Model Image Carousel -->
    <div class="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Left: Welcome Text & Info -->
          <div>
            <div class="mb-4">
              <p class="text-sm font-semibold uppercase tracking-wide opacity-90">{{ getCurrentHeroSlide.tagline }}</p>
            </div>
            <h1 class="text-5xl font-bold mb-4 leading-tight">{{ getCurrentHeroSlide.title }}</h1>
            <p class="text-lg opacity-90 mb-6">{{ getCurrentHeroSlide.description }}</p>
            <p class="text-sm opacity-80 mb-8">Trending on Shopy • Fast Delivery • Secure Checkout</p>
            <div class="space-y-4 mb-8">
              <div class="flex items-center space-x-3 group">
                <div class="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-xl group-hover:bg-opacity-50 transition">
                  👑
                </div>
                <span class="text-sm font-semibold">Curated Collections</span>
              </div>
              <div class="flex items-center space-x-3 group">
                <div class="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-xl group-hover:bg-opacity-50 transition">
                  ⚡
                </div>
                <span class="text-sm font-semibold">Latest Trends</span>
              </div>
              <div class="flex items-center space-x-3 group">
                <div class="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-xl group-hover:bg-opacity-50 transition">
                  ✨
                </div>
                <span class="text-sm font-semibold">Quality Guaranteed</span>
              </div>
            </div>
            <button class="bg-white text-orange-600 dark:text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition shadow-lg">
              {{ getCurrentHeroSlide.cta }}
            </button>
          </div>

          <!-- Right: Model Image Carousel -->
          <div class="relative">
            <div class="relative h-full rounded-2xl overflow-hidden shadow-2xl">
              <!-- Model Image -->
              <img
                :src="getCurrentHeroSlide.imageUrl"
                :alt="getCurrentHeroSlide.title"
                class="w-full h-96 object-cover"
              />
              <!-- Overlay Gradient -->
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-20"></div>
              
              <!-- Slide Counter -->
              <div class="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-bold">
                {{ currentHeroSlideIndex + 1 }}/{{ heroSlides.length }}
              </div>
            </div>

            <!-- Carousel Navigation Arrows -->
            <button
              @click="prevHeroSlide"
              class="absolute -left-6 top-1/2 -translate-y-1/2 bg-transparent text-gray-400 p-3 rounded-full transition font-bold text-lg hidden md:block hover:text-black"
            >
              ❮
            </button>
            <button
              @click="nextHeroSlide"
              class="absolute -right-6 top-1/2 -translate-y-1/2 bg-transparent text-gray-400 p-3 rounded-full transition font-bold text-lg hidden md:block hover:text-black"
            >
              ❯
            </button>

            <!-- Carousel Dots -->
            <div class="flex justify-center gap-2 mt-6">
              <button
                v-for="(_, idx) in heroSlides"
                :key="idx"
                @click="goToHeroSlide(idx)"
                :class="[
                  'rounded-full transition duration-300',
                  idx === currentHeroSlideIndex 
                    ? 'bg-white w-8 h-2' 
                    : 'bg-white bg-opacity-40 hover:bg-opacity-60 w-2 h-2'
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Category Filter -->

      <div class="mb-6 flex items-center space-x-4 overflow-x-auto pb-2">
        <button
          @click="selectedCategory = ''"
          :class="[
            'px-4 py-2 rounded-full font-medium whitespace-nowrap transition border',
            selectedCategory === ''
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-white border-gray-300 text-gray-900'
          ]"
        >
          All Categories
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-2 rounded-full font-medium whitespace-nowrap transition border',
            selectedCategory === cat
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-white border-gray-300 text-gray-900'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product._id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer"
          @click="openProductDetail(product)"
        >
          <!-- Product Image Container -->
          <div class="relative overflow-hidden bg-gray-200 h-56">
            <img
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <!-- Stock Badge -->
            <div
              v-if="product.stock === 0"
              class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <span class="text-white font-bold text-lg">Out of Stock</span>
            </div>
            <div
              :class="[
                'absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold',
                product.stock > 10
                  ? 'bg-green-500 text-white'
                  : product.stock > 0
                  ? 'bg-orange-500 text-white'
                  : 'bg-red-500 text-white'
              ]"
            >
              {{ product.stock > 0 ? `${product.stock} Left` : 'Out of Stock' }}
            </div>

            <!-- Wishlist Button (Only for logged-in users) -->
            <button
              v-if="authStore.isAuthenticated"
              @click.stop="handleToggleWishlist($event, product)"
              class="absolute top-2 left-2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:shadow-lg transition group/heart"
              :title="wishlistStore.isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'"
            >
              <span class="text-xl group-hover/heart:scale-110 transition-transform">
                {{ wishlistStore.isInWishlist(product._id) ? '❤️' : '🤍' }}
              </span>
            </button>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <!-- Category Badge -->
            <span class="inline-block bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200 text-xs font-semibold px-2 py-1 rounded mb-2">
              {{ product.category }}
            </span>

            <!-- Product Name -->
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {{ product.name }}
            </h3>

            <!-- Description -->
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
              {{ product.description }}
            </p>

            <!-- Price -->
            <div class="mb-4">
              <p class="text-2xl font-bold text-orange-600">
                KES {{ product.price.toLocaleString() }}
              </p>
            </div>

            <!-- Quick Add to Cart Button -->
            <button
              v-if="product.stock > 0"
              @click.stop="handleQuickAddToCart($event, product)"
              class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <span>🛒</span>
              <span>Add to Cart</span>
            </button>
            <button
              v-else
              disabled
              class="w-full bg-gray-400 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <p class="text-2xl text-gray-600 dark:text-gray-400 mb-4">🔍</p>
        <p class="text-lg text-gray-600 dark:text-gray-400">No products found</p>
        <button
          @click="searchQuery = ''; selectedCategory = ''"
          class="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div v-if="showModal" @click="closeModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
      <div
        @click.stop
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
      >
        <!-- Image Section (Top on mobile, Left on desktop) -->
        <div class="w-full md:w-2/5 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4 sm:p-6 flex-shrink-0">
          <img
            :src="selectedProduct?.imageUrl"
            :alt="selectedProduct?.name"
            class="w-full h-auto md:h-full object-cover rounded-lg max-h-[300px] md:max-h-none"
          />
        </div>

        <!-- Info Section (Bottom on mobile, Right on desktop) -->
        <div class="w-full md:w-3/5 flex flex-col p-4 sm:p-8 overflow-y-auto">
          <!-- Header with Wishlist & Close -->
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex-1 mr-4">{{ selectedProduct?.name }}</h2>
            <div class="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <!-- Wishlist Toggle Button (Only for logged-in users) -->
              <button
                v-if="authStore.isAuthenticated"
                @click.stop="handleToggleWishlist($event, selectedProduct!)"
                :title="wishlistStore.isInWishlist(selectedProduct?._id || '') ? 'Remove from Wishlist' : 'Add to Wishlist'"
                class="text-2xl sm:text-3xl hover:scale-125 transition-transform"
              >
                {{ wishlistStore.isInWishlist(selectedProduct?._id || '') ? '❤️' : '🤍' }}
              </button>
              <!-- Close Button -->
              <button
                @click="closeModal"
                class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl sm:text-3xl font-light hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Category Badge -->
          <span class="inline-block bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200 text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
            {{ selectedProduct?.category }}
          </span>

          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
            {{ selectedProduct?.description }}
          </p>

          <!-- Price Section -->
          <div class="mb-6 pb-6 border-b dark:border-gray-700">
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Price</p>
            <p class="text-3xl sm:text-4xl font-bold text-orange-600">
              KES {{ selectedProduct?.price.toLocaleString() }}
            </p>
          </div>

          <!-- Stock Section -->
          <div class="mb-6 pb-6 border-b dark:border-gray-700">
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Availability</p>
            <p :class="[
              'text-base sm:text-lg font-bold',
              (selectedProduct?.stock || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            ]">
              {{ (selectedProduct?.stock || 0) > 0 ? `${selectedProduct?.stock} items available` : 'Out of Stock' }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Buy Now Button -->
            <button
              @click="handleBuyNow"
              :disabled="!selectedProduct || selectedProduct.stock === 0"
              :class="[
                'w-full font-bold py-3 px-4 rounded-xl transition text-sm sm:text-base',
                (selectedProduct?.stock || 0) > 0
                  ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              ]"
            >
              {{ (selectedProduct?.stock || 0) > 0 ? '⚡ Buy Now' : 'Out of Stock' }}
            </button>

            <!-- Add to Cart Button -->
            <button
              @click="handleAddToCart"
              :disabled="!selectedProduct || selectedProduct.stock === 0"
              :class="[
                'w-full font-bold py-3 px-4 rounded-xl transition text-sm sm:text-base',
                (selectedProduct?.stock || 0) > 0
                  ? 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer'
                  : 'border-2 border-gray-400 text-gray-600 cursor-not-allowed'
              ]"
            >
              {{ (selectedProduct?.stock || 0) > 0 ? '🛒 Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #2563eb;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #1d4ed8;
}
</style>