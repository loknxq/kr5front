import { ref, computed, watch } from 'vue'
import { generateShades } from '../utils/color'

const STORAGE_KEY = 'color-palettes'

const defaultBases = ['#FF6B6B', '#4ECDC4', '#1A535C', '#FFE66D', '#2B2D42']

const createDefaultPalettes = () => {
  return defaultBases.map((hex, index) => ({
    id: `default-${index}`,
    name: `Базовая палитра ${index + 1}`,
    baseColor: hex,
    shadesCount: 5,
    colors: [],
    createdAt: new Date().toISOString()
  }))
}

const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
const initial = raw ? JSON.parse(raw) : createDefaultPalettes()

const palettes = ref(initial)
const filterText = ref('')
const sortBy = ref('date')
const shadesCount = ref(5)

const saveToStorage = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes.value))
}

watch(palettes, saveToStorage, { deep: true })

const filteredPalettes = computed(() => {
  const text = filterText.value.trim().toLowerCase()
  let list = [...palettes.value]
  if (text) {
    list = list.filter(p => p.name.toLowerCase().includes(text) || p.baseColor.toLowerCase().includes(text))
  }
  if (sortBy.value === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return list
})

const addPalette = payload => {
  const id = `p-${Date.now()}-${Math.random().toString(16).slice(2)}`
  palettes.value.push({
    id,
    name: payload.name,
    baseColor: payload.baseColor,
    shadesCount: payload.shadesCount,
    colors: payload.colors || [],
    createdAt: new Date().toISOString()
  })
}

const removePalette = id => {
  palettes.value = palettes.value.filter(p => p.id !== id)
}

const getPaletteById = id => {
  return palettes.value.find(p => p.id === id) || null
}

const getPaletteShades = palette => {
  if (palette.colors && palette.colors.length > 0) {
    return palette.colors.map((hex, index) => ({
      id: index,
      hex
    }))
  }
  return generateShades(palette.baseColor, palette.shadesCount || 5)
}

export const usePalettes = () => {
  return {
    palettes,
    filterText,
    sortBy,
    shadesCount,
    filteredPalettes,
    addPalette,
    removePalette,
    getPaletteById,
    getPaletteShades
  }
}

