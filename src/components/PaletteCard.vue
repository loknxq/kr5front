<template>
  <article
    class="palette-card"
    :aria-label="`Палитра ${palette.name}`"
  >
    <header class="palette-card-header">
      <h3>{{ palette.name }}</h3>
      <p class="palette-meta">
        {{ palette.baseColor }}
        ·
        {{ formattedDate }}
      </p>
    </header>
    <div class="swatches" role="list">
      <button
        v-for="shade in shades"
        :key="shade.id"
        class="swatch"
        :style="{ backgroundColor: shade.hex, color: getContrast(shade.hex) }"
        type="button"
        role="listitem"
        @click="copyHex(shade.hex)"
        :aria-label="`Скопировать цвет ${shade.hex}`"
      >
        <span class="swatch-hex">{{ shade.hex }}</span>
      </button>
    </div>
    <footer class="palette-card-footer">
      <button
        class="btn-secondary"
        type="button"
        @click="$emit('open', palette.id)"
      >
        Открыть
      </button>
      <button
        class="btn-danger"
        type="button"
        @click="$emit('remove', palette.id)"
      >
        Удалить
      </button>
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { getContrastYIQ } from '../utils/color'

const props = defineProps({
  palette: {
    type: Object,
    required: true
  },
  shades: {
    type: Array,
    required: true
  }
})

const formattedDate = computed(() => {
  return new Date(props.palette.createdAt).toLocaleString('ru-RU')
})

const getContrast = hex => {
  return getContrastYIQ(hex)
}

const copyHex = hex => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(hex)
  }
}
</script>

<style scoped>
.palette-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1rem 1.2rem;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.palette-card-header h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.palette-meta {
  margin: 0;
  font-size: 0.85rem;
  color: #666666;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.5rem;
}

.swatch {
  border: none;
  border-radius: var(--radius-md);
  padding: 0.7rem 0.4rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  font-size: 0.8rem;
}

.swatch:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
}

.swatch-hex {
  font-weight: 600;
}

.palette-card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.btn-secondary {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-danger {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid #dc3545;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-secondary:hover,
.btn-danger:hover {
  filter: brightness(0.95);
}
</style>
