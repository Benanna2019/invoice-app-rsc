import { currencyFormatter } from '@/utils'
import Link from 'next/link'
import { LabelText, inputClasses, submitButtonClasses } from '..'

interface DepositFormControlsCollection extends HTMLFormControlsCollection {
  amount?: HTMLInputElement
  depositDate?: HTMLInputElement
  note?: HTMLInputElement
  intent?: HTMLButtonElement
}

interface DepositData {
  customerName: string
  customerId: string
  totalAmount: number
  dueStatus: 'paid' | 'overpaid' | 'overdue' | 'due'
  dueDisplay: string
  invoiceDateDisplay: string
  lineItems: {
    id: string
    description: string
    quantity: number
    unitPrice: number
  }[]
  deposits: {
    id: string
    amount: number
    depositDateFormatted: string
  }[]
  invoiceId: string
}

const lineItemClassName =
  'flex justify-between border-t border-gray-100 py-4 text-[14px] leading-[24px]'

export function Deposits({ data }: { data: DepositData }) {
  // this is purely for helping the user have a better experience.

  //   if (newDepositFetcher.submission) {
  //     const amount = Number(newDepositFetcher.submission.formData.get('amount'))
  //     const depositDateVal =
  //       newDepositFetcher.submission.formData.get('depositDate')
  //     const depositDate =
  //       typeof depositDateVal === 'string' ? parseDate(depositDateVal) : null
  //     if (
  //       !validateAmount(amount) &&
  //       depositDate &&
  //       !validateDepositDate(depositDate)
  //     ) {
  //       deposits.push({
  //         id: 'new',
  //         amount,
  //         depositDateFormatted: depositDate.toLocaleDateString(),
  //       })
  //     }
  //   }

  return (
    <div>
      <div className="font-bold leading-8">Deposits</div>
      {data.deposits.length > 0 ? (
        data.deposits.map((deposit) => (
          <div key={deposit.id} className={lineItemClassName}>
            <Link
              href={`/sales/deposits/${deposit.id}`}
              className="text-blue-600 underline"
            >
              {deposit.depositDateFormatted}
            </Link>
            <div>{currencyFormatter.format(deposit.amount)}</div>
          </div>
        ))
      ) : (
        <div>None yet</div>
      )}
      <form
        method="POST"
        action="/api/depositActions"
        className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-2"
        noValidate
      >
        <div className="min-w-[100px]">
          <div className="flex flex-wrap items-center gap-1">
            <LabelText>
              <label htmlFor="depositAmount">Amount</label>
            </LabelText>
          </div>
          <input
            id="depositAmount"
            name="amount"
            type="number"
            className={inputClasses}
            min="0.01"
            step="any"
            required
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-1">
            <LabelText>
              <label htmlFor="depositDate">Date</label>
            </LabelText>
          </div>
          <input
            id="depositDate"
            name="depositDate"
            type="date"
            className={`${inputClasses} h-[34px]`}
            required
          />
          <label htmlFor="invoiceId" className="sr-only" />
          <input
            id="invoiceId"
            name="invoiceId"
            type="hidden"
            value={data.invoiceId}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:flex">
          <div className="flex-1">
            <LabelText>
              <label htmlFor="depositNote">Note</label>
            </LabelText>
            <input
              id="depositNote"
              name="note"
              type="text"
              className={inputClasses}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className={submitButtonClasses}
              name="intent"
              value="create-deposit"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export function LineItemDisplay({
  description,
  quantity,
  unitPrice,
}: {
  description: string
  quantity: number
  unitPrice: number
}) {
  return (
    <div className={lineItemClassName}>
      <div>{description}</div>
      {quantity === 1 ? null : <div className="text-[10px]">({quantity}x)</div>}
      <div>{currencyFormatter.format(unitPrice)}</div>
    </div>
  )
}
