import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize auth on app load
const authStore = useAuthStore()
authStore.initAuth()

// Initialize cart on app load
const cartStore = useCartStore()
cartStore.initCart()

app.mount('#app')