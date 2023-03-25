import {
  validateCustomerId,
  validateDueDate,
  validateLineItemQuantity,
  validateLineItemUnitPrice,
} from '@/app/sales/invoices/newInvoice/page'
import { LineItemFields, createInvoice } from '@/models/invoiceserver'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { parseDate } from '@/utils'
import { requireUser } from '@/utils/sessionserver'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import invariant from 'tiny-invariant'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  const formData = await request.formData()
  const intent = formData.get('intent')
  switch (intent) {
    case 'create': {
      const customerId = formData.get('customerId')
      const dueDateString = formData.get('dueDate')
      invariant(typeof customerId === 'string', 'customerId is required')
      invariant(typeof dueDateString === 'string', 'dueDate is required')
      const dueDate = parseDate(dueDateString)

      const lineItemIds = formData.getAll('lineItemId')
      const lineItemQuantities = formData.getAll('quantity')
      const lineItemUnitPrices = formData.getAll('unitPrice')
      const lineItemDescriptions = formData.getAll('description')
      const lineItems: Array<LineItemFields> = []
      for (let i = 0; i < lineItemQuantities.length; i++) {
        const quantity = +lineItemQuantities[i]
        const unitPrice = +lineItemUnitPrices[i]
        const description = lineItemDescriptions[i]
        invariant(typeof quantity === 'number', 'quantity is required')
        invariant(typeof unitPrice === 'number', 'unitPrice is required')
        invariant(typeof description === 'string', 'description is required')

        lineItems.push({ quantity, unitPrice, description })
      }

      const errors = {
        customerId: validateCustomerId(customerId),
        dueDate: validateDueDate(dueDate),
        lineItems: lineItems.reduce((acc, lineItem, index) => {
          const id = lineItemIds[index]
          invariant(typeof id === 'string', 'lineItem ids are required')
          acc[id] = {
            quantity: validateLineItemQuantity(lineItem.quantity),
            unitPrice: validateLineItemUnitPrice(lineItem.unitPrice),
          }
          return acc
        }, {} as Record<string, { quantity: null | string; unitPrice: null | string }>),
      }

      const customerIdHasError = errors.customerId !== null
      const dueDateHasError = errors.dueDate !== null
      const lineItemsHaveErrors = Object.values(errors.lineItems).some(
        (lineItem) => Object.values(lineItem).some(Boolean),
      )
      const hasErrors =
        dueDateHasError || customerIdHasError || lineItemsHaveErrors

      if (hasErrors) {
        return NextResponse.json({ errors, status: 400 })
      }

      const invoice = await createInvoice({ dueDate, customerId, lineItems })

      return redirect(`/sales/invoices/${invoice.id}`)
    }
  }
  return new Response(`Unsupported intent: ${intent}`, { status: 400 })
}
