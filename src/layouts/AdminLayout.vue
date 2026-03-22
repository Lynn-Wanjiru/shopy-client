<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const sidebarOpen = ref(true)

const navItems = [
  { label: 'Create Product', icon: '➕', route: '/admin/create-product' },
  { label: 'Inventory', icon: '📦', route: '/admin/products' },
  { label: 'Orders', icon: '🛒', route: '/admin/orders' },
  { label: 'Users', icon: '👥', route: '/admin/users' },
]
</script>

<template>
  <div class="flex h-screen bg-blue-50">
    <!-- Sidebar -->
    <div :class="['bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 shadow-lg', sidebarOpen ? 'w-64' : 'w-20']">
      <!-- Logo -->
      <div class="p-4 border-b border-blue-700">
        <div v-if="sidebarOpen" class="text-2xl font-bold">⚙️ Shopy Admin</div>
        <div v-else class="text-2xl font-bold text-center">⚙️</div>
      </div>

      <!-- Navigation -->
      <nav class="mt-6">
        <RouterLink
          v-for="item in navItems"
          :key="item.route"
          :to="item.route"
          :class="[
            'flex items-center px-4 py-3 hover:bg-blue-700 transition duration-200',
            $route.path === item.route ? 'bg-blue-500 border-l-4 border-white' : ''
          ]"
        >
          <span class="text-2xl">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="ml-4 font-semibold">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <div class="bg-white shadow-md">
        <div class="flex items-center justify-between px-6 py-4">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="text-2xl hover:bg-blue-100 p-2 rounded transition"
          >
            ☰
          </button>
          <div class="text-gray-600 font-semibold">Welcome, Admin 👋</div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto bg-blue-50">
        <RouterView />
      </div>
    </div>
  </div>
</template>