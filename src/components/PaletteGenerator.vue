<template>
  <section class="generator">
    <header class="generator-header">
      <h2>Генератор палитр</h2>
      <div class="controls">
        <div class="field">
          <label for="count">Количество цветов</label>
          <select id="count" v-model.number="colorsCount">
            <option :value="3">3</option>
            <option :value="5">5</option>
            <option :value="7">7</option>
          </select>
        </div>
        <div class="field">
          <label for="format">Формат</label>
          <select id="format" v-model="format">
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
        <button
          type="button"
          class="btn-primary"
          @click="generate"
        >
          Случайная палитра
        </button>
        <button
          type="button"
          class="btn-secondary"
          @click="saveCurrent"
        >
          Сохранить палитру
        </button>
      </div>
    </header>

    <div class="strip" role="list">
      <button
        v-for="color in colors"
        :key="color.id"
        class="strip-item"
        :style="{ backgroundColor: color.hex, color: contrast(color.hex) }"
        type="button"
        role="listitem"
        @click="handleCopy(color)"
      >
        <span class="value">
          {{ displayValue(color.hex) }}
        </span>
        <span
          class="pin"
          :class="{ active: pinnedIds.includes(color.id) }"
          @click.stop="togglePin(color.id)"
          aria-label="Закрепить цвет"
        >
          &#9733;
        </span>
      </button>
    </div>

    <section class="mockup">
      <header class="mockup-header">
        <h3>Превью интерфейса</h3>
        <div class="mockup-controls">
          <label>
            <input
              type="radio"
              value="light"
              v-model="mockupTheme"
            />
            Светлый фон
          </label>
          <label>
            <input
              type="radio"
              value="dark"
              v-model="mockupTheme"
            />
            Тёмный фон
          </label>
        </div>
      </header>

      <div
        class="mockup-body"
        :class="mockupThemeClass"
      >
        <button
          type="button"
          class="mockup-button"
          :style="buttonStyle"
        >
          Кнопка
        </button>
        <article class="mockup-card">
          <h4 :style="titleStyle">Заголовок</h4>
          <p>Текст карточки, чтобы проверить контраст и читаемость.</p>
        </article>
      </div>
    </section>

    <Toast
      v-model="toastVisible"
      :message="toastMessage"
      :duration="1800"
    />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Toast from './Toast.vue'
import { hexToRgb, rgbToHex, getContrastYIQ } from '../utils/color'
import { usePalettes } from '../composables/usePalettes'

const router = useRouter()
const { addPalette } = usePalettes()

const colorsCount = ref(5)
const format = ref('hex')
const colors = ref([])
const pinnedIds = ref([])
const mockupTheme = ref('light')
const toastVisible = ref(false)
const toastMessage = ref('')

const showToast = message => {
  toastMessage.value = message
  toastVisible.value = false
  requestAnimationFrame(() => {
    toastVisible.value = true
  })
}

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomHex = () => {
  const r = randomInt(0, 255)
  const g = randomInt(0, 255)
  const b = randomInt(0, 255)
  return rgbToHex(r, g, b)
}

const generate = () => {
  const pinned = colors.value.filter(c => pinnedIds.value.includes(c.id))
  const newColors = []
  for (let i = 0; i < colorsCount.value; i += 1) {
    const existing = pinned.find(c => c.index === i)
    if (existing) {
      newColors.push(existing)
    } else {
      newColors.push({
        id: `c-${Date.now()}-${i}-${Math.random().toString(16).slice(2)}`,
        index: i,
        hex: randomHex()
      })
    }
  }
  colors.value = newColors
}

const contrast = hex => {
  return getContrastYIQ(hex)
}

const toRgbString = hex => {
  const rgb = hexToRgb(hex)
  if (!rgb) return ''
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

const displayValue = hex => {
  if (format.value === 'rgb') {
    return toRgbString(hex)
  }
  return hex
}

const togglePin = id => {
  if (pinnedIds.value.includes(id)) {
    pinnedIds.value = pinnedIds.value.filter(x => x !== id)
  } else {
    pinnedIds.value = [...pinnedIds.value, id]
  }
}

const handleCopy = color => {
  const value = displayValue(color.hex)
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value)
    showToast('Цвет скопирован')
  }
}

const mockupThemeClass = computed(() => {
  return mockupTheme.value === 'dark' ? 'mockup-dark' : 'mockup-light'
})

const buttonStyle = computed(() => {
  if (colors.value.length === 0) return {}
  const c = colors.value[0]
  return {
    backgroundColor: c.hex,
    color: contrast(c.hex)
  }
})

const titleStyle = computed(() => {
  if (colors.value.length < 2) return {}
  const c = colors.value[1]
  return {
    color: c.hex
  }
})

const saveCurrent = () => {
  if (colors.value.length === 0) {
    generate()
  }
  const base = colors.value[0]
  addPalette({
    name: 'Сгенерированная палитра',
    baseColor: base.hex,
    shadesCount: colorsCount.value,
    colors: colors.value.map(c => c.hex)
  })
  showToast('Палитра сохранена')
  router.push({ name: 'Palettes' })
}
</script>

<style scoped>
.generator {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.generator-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

select {
  padding: 0.4rem 0.7rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-primary {
  border: none;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  background-color: #f2f2f2;
}

.btn-primary:hover,
.btn-secondary:hover {
  filter: brightness(0.95);
}

.strip {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 0.4rem;
  padding-bottom: 0.4rem;
}

.strip-item {
  min-width: 120px;
  border-radius: var(--radius-md);
  border: none;
  padding: 0.8rem 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.value {
  font-weight: 600;
  font-size: 0.9rem;
}

.pin {
  font-size: 1rem;
  opacity: 0.6;
}

.pin.active {
  opacity: 1;
}

.mockup {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mockup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.mockup-controls {
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.mockup-body {
  border-radius: var(--radius-lg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mockup-light {
  background-color: #f7f7f7;
  color: #222222;
}

.mockup-dark {
  background-color: #111111;
  color: #f5f5f5;
}

.mockup-button {
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.mockup-card {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 0.9rem 1rem;
  backdrop-filter: blur(6px);
}
</style>
