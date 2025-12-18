<template>
  <section class="home-page">
    <header>
      <h2>Добро пожаловать в менеджер палитр</h2>
      <p>
        Создавайте, сохраняйте и исследуйте цветовые палитры с HEX и RGB, проверяя контрастность и удобство интерфейса.
      </p>
    </header>

    <section class="quick-actions" aria-label="Быстрые действия">
      <button type="button" class="btn-primary" @click="goToPalettes">
        Перейти к палитрам
      </button>
    </section>

    <section class="recent-palettes" aria-label="Последние палитры">
      <h3>Последние палитры</h3>
      <p v-if="recentPalettes.length === 0">
        Пока нет палитр. Создайте первую в разделе «Палитры».
      </p>
      <div v-else class="palettes-grid">
        <PaletteCard
          v-for="p in recentPalettes"
          :key="p.id"
          :palette="p"
          :shades="getPaletteShades(p)"
          @open="openPalette"
          @remove="removePalette"
        />
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PaletteCard from '../components/PaletteCard.vue'
import { usePalettes } from '../composables/usePalettes'

const router = useRouter()
const {
  palettes,
  removePalette,
  getPaletteShades
} = usePalettes()

const goToPalettes = () => {
  router.push({ name: 'Palettes' })
}

const goToSettings = () => {
  router.push({ name: 'SettingsTab', params: { tab: 'general' } })
}

const openPalette = id => {
  router.push({ name: 'PaletteDetails', params: { id } })
}

const recentPalettes = computed(() => {
  return [...palettes.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
})
</script>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header h2 {
  margin-bottom: 0.5rem;
}

header p {
  margin: 0;
  color: #555555;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}3

.btn-primary,
.btn-secondary {
  padding: 0.6rem 1.3rem;
  border-radius: 999px;
  font-size: 0.95rem;
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

.recent-palettes h3 {
  margin-bottom: 0.5rem;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}
</style>
