import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDarkMode = ref(false)

  // Load dark mode preference from localStorage
  const initDarkMode = () => {
    const saved = localStorage.getItem('darkMode') === 'true'
    isDarkMode.value = saved
    applyDarkMode()
  }

  // Apply dark mode to document
  const applyDarkMode = () => {
    const html = document.documentElement
    if (isDarkMode.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // Toggle dark mode
  const toggle = () => {
    isDarkMode.value = !isDarkMode.value
  }

  // Watch for changes and persist to localStorage
  watch(isDarkMode, (newValue) => {
    localStorage.setItem('darkMode', String(newValue))
    applyDarkMode()
  })

  return {
    isDarkMode,
    initDarkMode,
    applyDarkMode,
    toggle
  }
})
