import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PodOrderService } from '@/shared/db/services/pod-order.service'

/**
 * GET /api/print-on-demand/orders/[id]
 * PATCH /api/print-on-demand/orders/[id] (update order)
 * DELETE /api/print-on-demand/orders/[id] (soft delete)
 */

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'PRODUCTION', 'QUALITY_CHECK', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await PodOrderService.getOrderById(params.id)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    console.error('[Get Order] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updates = updateOrderSchema.parse(body)

    const order = await PodOrderService.getOrderById(params.id)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status if provided
    let updatedOrder = order
    if (updates.status) {
      updatedOrder = await PodOrderService.updateOrderStatus(
        params.id,
        updates.status,
        updates.notes,
        updates.trackingNumber
      )
    } else if (updates.trackingNumber || updates.notes) {
      // Update tracking or notes without changing status
      const { prisma } = await import('@/shared/db/client')
      updatedOrder = await prisma.podOrder.update({
        where: { id: params.id },
        data: {
          ...(updates.trackingNumber && { trackingNumber: updates.trackingNumber }),
          ...(updates.notes && { notes: updates.notes }),
        },
        include: {
          items: {
            include: {
              podProduct: true,
              podDesign: true,
            },
          },
          payment: true,
          fulfillmentTimeline: true,
        },
      })
    }

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    console.error('[Update Order] Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await PodOrderService.getOrderById(params.id)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of cancelled or pending orders
    if (!['CANCELLED', 'PENDING'].includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot delete order with status ${order.status}` },
        { status: 400 }
      )
    }

    const deletedOrder = await PodOrderService.deleteOrder(params.id)

    return NextResponse.json(
      { message: 'Order deleted successfully', order: deletedOrder },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Delete Order] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
