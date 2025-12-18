<template>
  <section class="not-found">
    <h1>404 – страница не найдена</h1>
    <p>Запрошенный путь недоступен.</p>
    <div class="debug">
      <p><strong>Путь:</strong> {{ route.path }}</p>
      <p><strong>Параметры:</strong> {{ route.params }}</p>
    </div>
    <button type="button" class="btn-primary" @click="goHome">
      На главную
    </button>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goHome = () => {
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.not-found {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.debug {
  margin: 1rem auto;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background-color: #f8f9fa;
  font-family: monospace;
  font-size: 0.85rem;
}

.btn-primary {
  padding: 0.6rem 1.3rem;
  border-radius: 999px;
  border: none;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:hover {
  filter: brightness(0.95);
}
</style>
