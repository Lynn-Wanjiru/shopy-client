<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useDarkModeStore } from '@/stores/darkMode'

const darkModeStore = useDarkModeStore()

onMounted(() => {
  darkModeStore.initDarkMode()
})
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>
