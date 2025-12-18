<template>
  <div class="accessibility-toggle">
    <h2>Доступность</h2>
    <div class="option">
      <label>
        <input
          type="checkbox"
          :checked="isHighContrast"
          @change="toggleContrast"
        />
        Высокий контраст (WCAG AA)
      </label>
    </div>
    <div class="option">
      <label>
        <input
          type="checkbox"
          :checked="isDarkTheme"
          @change="toggleTheme"
        />
        Тёмная тема
      </label>
    </div>
    <p class="note">
      Используйте Tab и Shift+Tab для навигации по элементам интерфейса.
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const getTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('app-theme')
  return stored === 'dark' ? 'dark' : 'light'
}

const getContrast = () => {
  if (typeof window === 'undefined') return 'normal'
  const stored = window.localStorage.getItem('app-contrast')
  return stored === 'high' ? 'high' : 'normal'
}

const isDarkTheme = computed(() => getTheme() === 'dark')
const isHighContrast = computed(() => getContrast() === 'high')

const setTheme = theme => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('app-theme', theme)
  document.documentElement.dataset.theme = theme
}

const setContrast = value => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('app-contrast', value)
  document.documentElement.dataset.contrast = value
}

const toggleTheme = () => {
  const theme = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(theme)
}

const toggleContrast = () => {
  const value = getContrast() === 'high' ? 'normal' : 'high'
  setContrast(value)
}
</script>

<style scoped>
.accessibility-toggle {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option {
  display: flex;
  align-items: center;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.note {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #666666;
}
</style>
