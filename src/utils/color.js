const clamp = value => {
  if (value < 0) return 0
  if (value > 255) return 255
  return Math.round(value)
}

export const hexToRgb = hex => {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

export const rgbToHex = (r, g, b) => {
  const rr = clamp(r).toString(16).padStart(2, '0')
  const gg = clamp(g).toString(16).padStart(2, '0')
  const bb = clamp(b).toString(16).padStart(2, '0')
  return `#${rr}${gg}${bb}`.toUpperCase()
}

export const lightenHex = (hex, amount) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const factor = amount
  const r = clamp(rgb.r + (255 - rgb.r) * factor)
  const g = clamp(rgb.g + (255 - rgb.g) * factor)
  const b = clamp(rgb.b + (255 - rgb.b) * factor)
  return rgbToHex(r, g, b)
}

export const darkenHex = (hex, amount) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const factor = 1 - amount
  const r = clamp(rgb.r * factor)
  const g = clamp(rgb.g * factor)
  const b = clamp(rgb.b * factor)
  return rgbToHex(r, g, b)
}

export const getContrastYIQ = hex => {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return yiq >= 128 ? '#000000' : '#FFFFFF'
}

export const generateShades = (baseHex, count) => {
  const steps = count === 3 ? [-0.2, 0, 0.2] : count === 5 ? [-0.3, -0.1, 0, 0.1, 0.3] : [-0.4, -0.2, 0, 0.2, 0.4, 0.6, -0.6]
  return steps.map((step, index) => {
    if (step === 0) {
      return {
        id: index,
        hex: baseHex
      }
    }
    if (step > 0) {
      return {
        id: index,
        hex: lightenHex(baseHex, step)
      }
    }
    return {
      id: index,
      hex: darkenHex(baseHex, Math.abs(step))
    }
  })
}
