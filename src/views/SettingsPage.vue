<template>
  <section class="settings-page">
    <h2>Настройки</h2>
    <nav class="settings-tabs" aria-label="Разделы настроек">
      <router-link
        :to="{ name: 'SettingsTab', params: { tab: 'general' } }"
        class="tab"
      >
        Общие
      </router-link>
      <router-link
        :to="{ name: 'SettingsTab', params: { tab: 'accessibility' } }"
        class="tab"
      >
        Доступность
      </router-link>
      <router-link
        :to="{ name: 'SettingsTab', params: { tab: 'about' } }"
        class="tab"
      >
        О приложении
      </router-link>
    </nav>

    <section class="settings-content">
      <div v-if="currentTab === 'general'">
        <h3>Общие настройки</h3>
        <p>
          Здесь вы можете изменить базовую тему приложения и параметры отображения палитр.
        </p>
        <div class="field">
          <label for="themeSelect">Тема приложения</label>
          <select id="themeSelect" v-model="theme" @change="applyTheme">
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </div>
      </div>

      <div v-else-if="currentTab === 'accessibility'">
        <AccessibilityToggle />
      </div>

      <div v-else-if="currentTab === 'about'">
        <h3>О приложении</h3>
        <p>
          Приложение создано для контрольной работы по практическим занятиям 27–28 по теме frontend и backend разработки.
        </p>
        <ul class="about-list">
          <li>Vue 3 и Composition API</li>
          <li>Vue Router с параметрами и страницей 404</li>
          <li>Работа с HEX, RGB и localStorage</li>
          <li>Функции доступности и контраста (WCAG AA)</li>
        </ul>
      </div>

      <div v-else>
        <p>Такого раздела настроек нет.</p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AccessibilityToggle from '../components/AccessibilityToggle.vue'

const props = defineProps({
  tab: {
    type: String,
    default: 'general'
  }
})

const route = useRoute()

const currentTab = computed(() => {
  return route.params.tab || props.tab || 'general'
})

const getStoredTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('app-theme')
  return stored === 'dark' ? 'dark' : 'light'
}

const theme = ref(getStoredTheme())

const applyTheme = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('app-theme', theme.value)
  document.documentElement.dataset.theme = theme.value
}

watch(
  () => route.params.tab,
  () => {}
)
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
}

.settings-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  border-bottom: 2px solid #eeeeee;
}

.tab {
  padding: 0.4rem 0.9rem;
  border-radius: 6px 6px 0 0;
  border: 1px solid transparent;
  border-bottom: 2px solid transparent;
  font-size: 0.9rem;
}

.tab.router-link-active {
  border-color: #dddddd;
  border-bottom-color: white;
  background-color: white;
}

.settings-content {
  padding: 1.25rem;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.field {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

select {
  padding: 0.45rem 0.6rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.about-list {
  margin: 0.75rem 0 0;
  padding-left: 1.1rem;
}
</style>
