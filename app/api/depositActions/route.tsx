import {
  validateAmount,
  validateDepositDate,
} from '@/app/sales/invoices/[invoiceId]/page'
import { createDeposit, deleteDeposit } from '@/models/depositserver'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { parseDate } from '@/utils'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import invariant from 'tiny-invariant'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const invoiceId = formData.get('invoiceId')
  if (typeof invoiceId !== 'string') {
    throw new Error('This should be impossible.')
  }

  const intent = formData.get('intent')
  invariant(typeof intent === 'string', 'intent required')
  switch (intent) {
    case 'create-deposit': {
      const amount = Number(formData.get('amount'))
      const depositDateString = formData.get('depositDate')
      const note = formData.get('note')
      invariant(!Number.isNaN(amount), 'amount must be a number')
      invariant(typeof depositDateString === 'string', 'dueDate is required')
      invariant(typeof note === 'string', 'dueDate is required')
      const depositDate = parseDate(depositDateString)

      const errors = {
        amount: validateAmount(amount),
        depositDate: validateDepositDate(depositDate),
      }
      const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage,
      )
      if (hasErrors) {
        return errors
      }

      await createDeposit({ invoiceId, amount, note, depositDate })
      return redirect(`/sales/invoices/${invoiceId}`)
    }
    default: {
      throw new Error(`Unsupported intent: ${intent}`)
    }
  }
}

export async function DELETE({
  request,
  params,
}: {
  request: NextRequest
  params: any
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { depositId } = params
  invariant(typeof depositId === 'string', 'params.depositId is not available')
  const formData = await request.formData()
  const intent = formData.get('intent')
  invariant(typeof intent === 'string', 'intent must be a string')
  switch (intent) {
    case 'delete': {
      await deleteDeposit(depositId)
      return redirect('/sales/deposits')
    }
    default: {
      throw new Error(`Unsupported intent: ${intent}`)
    }
  }
}
