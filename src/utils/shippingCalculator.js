import { supabase } from '../lib/supabase'
import { getRegionFromCountry } from './helpers'

export async function calculateShippingRate(countryCode, weightKg) {
  const region = getRegionFromCountry(countryCode)
  const isFreight = weightKg >= 50

  const { data, error } = await supabase
    .from('shipping_rates')
    .select('*')
    .eq('region', region)
    .eq('is_freight', isFreight)
    .eq('is_active', true)
    .lte('weight_min', weightKg)
    .gte('weight_max', weightKg)
    .single()

  if (error || !data) {
    const { data: fallback } = await supabase
      .from('shipping_rates')
      .select('*')
      .eq('region', region)
      .eq('is_freight', isFreight)
      .eq('is_active', true)
      .order('weight_max', { ascending: false })
      .limit(1)
      .single()

    return fallback || null
  }

  return data
}

export async function getShippingRatesForRegion(countryCode) {
  const region = getRegionFromCountry(countryCode)

  const { data, error } = await supabase
    .from('shipping_rates')
    .select('*')
    .eq('region', region)
    .eq('is_active', true)
    .order('weight_min', { ascending: true })

  if (error) return []
  return data
}
