<template>
  <section class="palettes-page">
    <div class="layout">
      <div class="left-column">
        <PaletteForm @submit="handleAddPalette" />
      </div>
      <div class="right-column">
        <div class="toolbar" aria-label="Фильтр палитр">
          <div class="field">
            <label for="search">Поиск</label>
            <input
              id="search"
              v-model="filterText"
              type="text"
              placeholder="Название или HEX"
              autocomplete="off"
            />
          </div>
          <div class="field">
            <label for="sort">Сортировка</label>
            <select id="sort" v-model="sortBy">
              <option value="date">По дате</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>

        <p class="stats">
          Всего палитр: {{ palettes.length }} · Отфильтровано: {{ filteredPalettes.length }}
        </p>

        <div v-if="filteredPalettes.length === 0" class="empty-state">
          <p>Палитры не найдены. Измените условия поиска или создайте новую палитру.</p>
        </div>
        <div v-else class="palettes-grid">
          <PaletteCard
            v-for="p in filteredPalettes"
            :key="p.id"
            :palette="p"
            :shades="getPaletteShades(p)"
            @open="openPalette"
            @remove="removePalette"
          />
        </div>

        <PaletteGenerator />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PaletteForm from '../components/PaletteForm.vue'
import PaletteCard from '../components/PaletteCard.vue'
import PaletteGenerator from '../components/PaletteGenerator.vue'
import { usePalettes } from '../composables/usePalettes'

const router = useRouter()

const {
  palettes,
  filterText,
  sortBy,
  filteredPalettes,
  addPalette,
  removePalette,
  getPaletteShades
} = usePalettes()

const handleAddPalette = payload => {
  addPalette(payload)
}

const openPalette = id => {
  router.push({ name: 'PaletteDetails', params: { id } })
}
</script>


<style scoped>
.palettes-page {
  max-width: 1200px;
  margin: 0 auto;
}

.layout {
  display: grid;
  grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
  gap: 1.5rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

input,
select {
  padding: 0.45rem 0.6rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.stats {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: #555555;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}

.empty-state {
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: #f0f0f0;
  color: #555555;
}

.left-column {
  position: sticky;
  top: 1rem;
  align-self: flex-start;
}

@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .left-column {
    position: static;
  }
}
</style>
