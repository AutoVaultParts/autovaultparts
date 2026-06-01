import { FREE_SHIPPING_THRESHOLDS, SHIPPING_REGIONS } from './constants'

export function getRegionFromCountry(countryCode) {
  for (const [region, countries] of Object.entries(SHIPPING_REGIONS)) {
    if (countries.includes(countryCode)) return region
  }
  return 'EU'
}

export function getFreeShippingThreshold(countryCode) {
  const region = getRegionFromCountry(countryCode)
  return FREE_SHIPPING_THRESHOLDS[region] || FREE_SHIPPING_THRESHOLDS.EU
}

export function qualifiesForFreeShipping(subtotal, countryCode) {
  const threshold = getFreeShippingThreshold(countryCode)
  return subtotal >= threshold
}

export function amountToFreeShipping(subtotal, countryCode) {
  const threshold = getFreeShippingThreshold(countryCode)
  const remaining = threshold - subtotal
  return remaining > 0 ? remaining : 0
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `AVP-${timestamp}-${random}`
}

export function isFreightItem(weightKg) {
  return weightKg >= 50
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
