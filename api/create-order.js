import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

function generateOrderNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 90000) + 10000
  return `AVP-${year}-${random}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { items, address, paymentMethod, subtotal } = req.body

    if (!items || !address || !paymentMethod || !subtotal) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const orderNumber = generateOrderNumber()

    const hasFreight = items.some(i => i.isFreight)
    const nonFreightSubtotal = items
      .filter(i => !i.isFreight)
      .reduce((sum, i) => sum + i.price * i.quantity, 0)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        payment_method: paymentMethod,
        status: paymentMethod === 'zelle' ? 'pending_payment' : 'confirmed',
        subtotal: subtotal,
        shipping_cost: 0,
        total: subtotal,
        shipping_address: address,
        is_freight: hasFreight,
        zelle_confirmed: false,
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    await supabase
      .from('order_tracking_events')
      .insert({
        order_id: order.id,
        status_label: 'Order Confirmed',
        location: 'AutoVaultParts',
        description: 'Your order has been received and is being processed',
        is_visible: true,
      })

    return res.status(200).json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return res.status(500).json({ error: 'Failed to create order' })
  }
}