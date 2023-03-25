import Link from 'next/link'
import { LabelText } from '@/components'
import { getInvoiceDetails } from '@/models/invoiceserver'
import { currencyFormatter } from '@/utils'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Deposits, LineItemDisplay } from '@/components/deposit'

export function validateAmount(amount: number) {
  if (amount <= 0) return 'Must be greater than 0'
  if (Number(amount.toFixed(2)) !== amount) {
    return 'Must only have two decimal places'
  }
  return null
}

export function validateDepositDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return 'Please enter a valid date'
  }
  return null
}

export const lineItemClassName =
  'flex justify-between border-t border-gray-100 py-4 text-[14px] leading-[24px]'

export default async function InvoiceRoute({ params }: { params: any }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }
  const { invoiceId } = params
  if (typeof invoiceId !== 'string') {
    throw new Error('This should be impossible.')
  }
  const invoiceDetails = await getInvoiceDetails(invoiceId)
  if (!invoiceDetails) {
    throw new Response('not found', { status: 404 })
  }
  const data = {
    customerName: invoiceDetails.invoice.customer.name,
    customerId: invoiceDetails.invoice.customer.id,
    totalAmount: invoiceDetails.totalAmount,
    dueStatus: invoiceDetails.dueStatus,
    dueDisplay: invoiceDetails.dueStatusDisplay,
    invoiceDateDisplay: invoiceDetails.invoice.invoiceDate.toLocaleDateString(),
    lineItems: invoiceDetails.invoice.lineItems.map((li) => ({
      id: li.id,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
    })),
    deposits: invoiceDetails.invoice.deposits.map((deposit) => ({
      id: deposit.id,
      amount: deposit.amount,
      depositDateFormatted: deposit.depositDate.toLocaleDateString(),
    })),
    invoiceId: invoiceId,
  }

  return (
    <div className="relative p-10">
      <Link
        href={`/sales/customers/${data.customerId}`}
        className="text-[length:14px] font-bold leading-6 text-blue-600 underline"
      >
        {data.customerName}
      </Link>
      <div className="text-[length:32px] font-bold leading-[40px]">
        {currencyFormatter.format(data.totalAmount)}
      </div>
      <LabelText>
        <span
          className={
            data.dueStatus === 'paid'
              ? 'text-green-brand'
              : data.dueStatus === 'overdue'
              ? 'text-red-brand'
              : ''
          }
        >
          {data.dueDisplay}
        </span>
        {` • Invoiced ${data.invoiceDateDisplay}`}
      </LabelText>
      <div className="h-4" />
      {data.lineItems.map((item) => (
        <LineItemDisplay
          key={item.id}
          description={item.description}
          unitPrice={item.unitPrice}
          quantity={item.quantity}
        />
      ))}
      <div className={`${lineItemClassName} font-bold`}>
        <div>Net Total</div>
        <div>{currencyFormatter.format(data.totalAmount)}</div>
      </div>
      <div className="h-8" />
      <Deposits data={data} />
    </div>
  )
}
