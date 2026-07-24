export const BRAND = {
  name: 'AutoVaultParts',
  tagline: 'Quality Parts. Global Delivery. Every Car.',
  url: 'autovaultparts.com',
  email: 'orders@autovaultparts.com',
  adminPath: '/dashboard-x7k2p',
}

export const FREE_SHIPPING_THRESHOLDS = {
  US: 1000,
  CA: 1300,
  EU: 1500,
  AU: 1800,
  SA: 1500,
}

export const SHIPPING_REGIONS = {
  US: ['US'],
  CA: ['CA'],
  AU: ['AU', 'NZ'],

  // All European countries
  EU: [
    'GB', 'DE', 'FR', 'NL', 'BE', 'IT', 'ES', 'SE', 'NO', 'DK',
    'AT', 'CH', 'PT', 'IE', 'FI', 'LU', 'PL', 'CZ', 'SK', 'HU',
    'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT', 'GR', 'MT', 'CY',
    'IS', 'LI', 'AL', 'BA', 'ME', 'MK', 'RS', 'XK', 'MD', 'UA',
    'BY', 'GE', 'AM', 'AZ',
  ],

  // All South American countries
  SA: [
    'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY',
    'GY', 'SR', 'GF',
  ],
}

export const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'quality_check',
  'ready_to_ship',
  'handed_to_carrier',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled',
]

export const ORDER_STATUS_LABELS = {
  pending: 'Order Pending',
  paid: 'Order Confirmed',
  processing: 'We are preparing your item for dispatch',
  quality_check: 'Your item is undergoing our quality inspection',
  ready_to_ship: 'Your order has passed inspection and is being packaged',
  handed_to_carrier: 'Your order has been collected by our shipping partner',
  in_transit: 'Your order is on its way',
  out_for_delivery: 'Your order will be delivered today',
  delivered: 'Your order has been delivered',
  cancelled: 'Order Cancelled',
}

export const PART_CONDITIONS = [
  { value: 'new_oem', label: 'New OEM' },
  { value: 'new_aftermarket', label: 'New Aftermarket' },
  { value: 'remanufactured', label: 'Remanufactured' },
  { value: 'used', label: 'Used / Pull' },
]

export const PART_CATEGORIES = [
  { value: 'body', label: 'Body Parts' },
  { value: 'engine', label: 'Engines and Assemblies' },
  { value: 'internal', label: 'Internal Parts' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'suspension', label: 'Suspension and Steering' },
  { value: 'electrical', label: 'Electrical and Lighting' },
  { value: 'exhaust', label: 'Exhaust System' },
]

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit or Debit Card', global: true },
  { value: 'paypal', label: 'PayPal', global: true },
  { value: 'apple_pay', label: 'Apple Pay', global: true },
  { value: 'google_pay', label: 'Google Pay', global: true },
  { value: 'cashapp', label: 'Cash App Pay', global: false, regions: ['US'] },
  { value: 'zelle', label: 'Zelle', global: false, regions: ['US'] },
]

export const MIN_PRODUCT_PRICE = 100
export const FREIGHT_WEIGHT_THRESHOLD = 50
export const HIGH_VALUE_ORDER_THRESHOLD = 2000