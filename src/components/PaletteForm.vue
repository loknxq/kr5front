<template>
  <form class="palette-form" @submit.prevent="handleSubmit">
    <h2>Создать палитру</h2>
    <div class="field">
      <label for="name">Название палитры</label>
      <input
        id="name"
        v-model="name"
        type="text"
        required
        autocomplete="off"
      />
    </div>
    <div class="field">
      <label for="baseColor">Базовый цвет (HEX)</label>
      <input
        id="baseColor"
        v-model="baseColor"
        type="text"
        required
        pattern="#?[0-9a-fA-F]{6}"
        autocomplete="off"
      />
      <p class="hint">Например: #FF6B6B</p>
    </div>
    <div class="field">
      <label for="shadesCount">Количество оттенков</label>
      <select id="shadesCount" v-model.number="shadesCount">
        <option :value="3">3</option>
        <option :value="5">5</option>
        <option :value="7">7</option>
      </select>
    </div>
    <button class="btn-primary" type="submit">
      Добавить палитру
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const name = ref('')
const baseColor = ref('#FF6B6B')
const shadesCount = ref(5)

const normalizeHex = value => {
  const v = value.trim()
  if (!v) return ''
  if (v.startsWith('#')) return v.toUpperCase()
  return `#${v.toUpperCase()}`
}

const handleSubmit = () => {
  const hex = normalizeHex(baseColor.value)
  emit('submit', {
    name: name.value.trim(),
    baseColor: hex,
    shadesCount: shadesCount.value
  })
  name.value = ''
  baseColor.value = '#FF6B6B'
  shadesCount.value = 5
}
</script>

<style scoped>
.palette-form {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-weight: 600;
}

input,
select {
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
}

.hint {
  margin: 0;
  font-size: 0.8rem;
  color: #777777;
}

.btn-primary {
  margin-top: 0.5rem;
  align-self: flex-start;
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  border: none;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-primary:hover {
  filter: brightness(0.95);
}
</style>
