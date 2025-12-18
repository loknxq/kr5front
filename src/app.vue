<template>
  <div id="app" :class="themeClass">
    <header class="app-header">
      <h1>Цветовые палитры</h1>
      <nav class="navigation" aria-label="Основная навигация">
        <router-link to="/" class="nav-link" :class="{ active: isActiveRoute('/') }">Главная</router-link>
        <router-link to="/palettes" class="nav-link" :class="{ active: isActiveRoute('/palettes') }">Палитры</router-link>
    </nav>

    </header>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="app-footer">
      <p>💪</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActiveRoute = path => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const getThemeFromStorage = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('app-theme')
  return stored === 'dark' ? 'dark' : 'light'
}

const themeClass = computed(() => {
  const theme = getThemeFromStorage()
  return theme === 'dark' ? 'theme-dark' : 'theme-light'
})
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
}

.app-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.app-header p {
  margin: 0;
  opacity: 0.9;
}

.navigation {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.6rem 1.3rem;
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background-color: transparent;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.nav-link.active {
  background-color: white;
  color: var(--color-primary-dark);
}

.main-content {
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.app-footer {
  margin-top: auto;
  text-align: center;
  padding: 1rem;
  background-color: #333333;
  color: white;
  font-size: 0.9rem;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.theme-dark {
  background-color: #111111;
  color: #f5f5f5;
}

.theme-dark .app-footer {
  background-color: #000000;
}
</style>
