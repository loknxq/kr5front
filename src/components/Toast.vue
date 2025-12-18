<template>
  <div
    v-if="visible"
    class="toast"
    role="status"
    aria-live="polite"
  >
    {{ message }}
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)

watchEffect(() => {
  visible.value = props.modelValue
  if (visible.value && props.duration > 0) {
    setTimeout(() => {
      emit('update:modelValue', false)
    }, props.duration)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  z-index: 1000;
}
</style>
