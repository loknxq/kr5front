<template>
  <section class="details-page" v-if="palette">
    <header class="details-header">
      <h2>{{ palette.name }}</h2>
      <p class="subtitle">
        Базовый цвет {{ palette.baseColor }} · создана {{ createdAt }}
      </p>
      <div class="header-actions">
        <button type="button" class="btn-secondary" @click="goBack">
          Назад
        </button>
        <button type="button" class="btn-danger" @click="removeAndBack">
          Удалить палитру
        </button>
      </div>
    </header>

    <section class="shades-section" aria-label="Оттенки палитры">
      <h3>Оттенки</h3>
      <div class="shades-grid">
        <button
          v-for="shade in shades"
          :key="shade.id"
          class="shade"
          :style="{ backgroundColor: shade.hex, color: getContrast(shade.hex) }"
          type="button"
          @click="copyHex(shade.hex)"
          :aria-label="`Скопировать цвет ${shade.hex}`"
        >
          <span class="shade-hex">{{ shade.hex }}</span>
          <span class="shade-rgb">{{ toRgb(shade.hex) }}</span>
        </button>
      </div>
    </section>
  </section>
  <section v-else class="details-missing">
    <h2>Палитра не найдена</h2>
    <p>Проверьте корректность ссылки или вернитесь к списку палитр.</p>
    <button type="button" class="btn-primary" @click="goToPalettes">
      К списку палитр
    </button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePalettes } from '../composables/usePalettes'
import { hexToRgb, getContrastYIQ } from '../utils/color'

const route = useRoute()
const router = useRouter()
const { getPaletteById, removePalette, getPaletteShades } = usePalettes()

const palette = computed(() => {
  const id = route.params.id
  if (!id) return null
  return getPaletteById(id)
})

const shades = computed(() => {
  if (!palette.value) return []
  return getPaletteShades(palette.value)
})

const createdAt = computed(() => {
  if (!palette.value) return ''
  return new Date(palette.value.createdAt).toLocaleString('ru-RU')
})

const getContrast = hex => {
  return getContrastYIQ(hex)
}

const copyHex = hex => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(hex)
  }
}

const toRgb = hex => {
  const rgb = hexToRgb(hex)
  if (!rgb) return ''
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

const goBack = () => {
  router.back()
}

const goToPalettes = () => {
  router.push({ name: 'Palettes' })
}

const removeAndBack = () => {
  if (!palette.value) return
  removePalette(palette.value.id)
  router.push({ name: 'Palettes' })
}
</script>

<style scoped>
.details-page {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.details-header h2 {
  margin-bottom: 0.25rem;
}

.subtitle {
  margin: 0;
  color: #555555;
  font-size: 0.9rem;
}

.header-actions {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-secondary,
.btn-danger,
.btn-primary {
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  background-color: #f2f2f2;
}

.btn-danger {
  border: 1px solid #dc3545;
  background-color: #dc3545;
  color: white;
}

.btn-primary {
  border: none;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

.btn-secondary:hover,
.btn-danger:hover,
.btn-primary:hover {
  filter: brightness(0.95);
}

.shades-section h3 {
  margin-bottom: 0.5rem;
}

.shades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.shade {
  border-radius: var(--radius-md);
  border: none;
  padding: 0.9rem 0.7rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.shade:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
}

.shade-hex {
  font-weight: 700;
  font-size: 0.9rem;
}

.shade-rgb {
  font-size: 0.85rem;
}

.details-missing {
  max-width: 600px;
  margin: 0 auto;
}

.details-missing h2 {
  margin-bottom: 0.5rem;
}
</style>
