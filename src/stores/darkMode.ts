import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDarkMode = ref(false)

  // Load dark mode preference from localStorage
  const initDarkMode = () => {
    const saved = localStorage.getItem('darkMode') === 'true'
    
    // Check if device is mobile (viewport width < 768px)
    const isMobile = window.innerWidth < 768
    
    // Mobile: Always start in light mode (false)
    // Desktop: Use saved preference from localStorage
    isDarkMode.value = isMobile ? false : saved
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
