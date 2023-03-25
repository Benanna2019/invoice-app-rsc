'use client'

import Link from 'next/link'
import { useSpinDelay } from 'spin-delay'
import { FilePlusIcon, InvoiceDetailsFallback } from '@/components'
import { getCustomerListItems } from '@/models/customerserver'
import { Customer } from '@/models/customerserver'
import { usePathname } from 'next/navigation'

type LoadingCustomer = Awaited<ReturnType<typeof getCustomerListItems>>[number]

export default function CustomerLayout({
  customers,
  children,
}: {
  customers: Pick<Customer, 'email' | 'id' | 'name'>[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  let loadingCustomer: LoadingCustomer | undefined
  const newCustomerPathisActive = pathname === '/sales/customers/newCustomer'
  const individualCustomerPathisActive =
    pathname === `/sales/customers/[customerId]`

  const showSkeleton = useSpinDelay(Boolean(loadingCustomer), {
    delay: 200,
    minDuration: 300,
  })

  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-100">
      <div className="w-1/2 border-r border-gray-100">
        <Link
          href="/sales/customers/newCustomer"
          className={
            'block border-b-4 border-gray-100 py-3 px-4 hover:bg-gray-50' +
            ' ' +
            (newCustomerPathisActive ? 'bg-gray-50' : '')
          }
        >
          <span className="flex gap-1">
            <FilePlusIcon /> <span>Create new customer</span>
          </span>
        </Link>
        <div className="max-h-96 overflow-y-scroll">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/sales/customers/${customer.id}`}
              className={
                'block border-b border-gray-50 py-3 px-4 hover:bg-gray-50' +
                ' ' +
                (individualCustomerPathisActive ? 'bg-gray-50' : '')
              }
            >
              <div className="flex justify-between text-[length:14px] font-bold leading-6">
                <div>{customer.name}</div>
              </div>
              <div className="flex justify-between text-[length:12px] font-medium leading-4 text-gray-400">
                <div>{customer.email}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex w-1/2 flex-col justify-between">
        {loadingCustomer && showSkeleton ? (
          <CustomerSkeleton
            name={loadingCustomer.name}
            email={loadingCustomer.email}
          />
        ) : (
          <>{children}</>
        )}
        <small className="p-2 text-center">
          Note: this is arbitrarily slow to demonstrate pending UI.
        </small>
      </div>
    </div>
  )
}

function CustomerSkeleton({ name, email }: { name: string; email: string }) {
  return (
    <div className="relative p-10">
      <div className="text-[length:14px] font-bold leading-6">{email}</div>
      <div className="text-[length:32px] font-bold leading-[40px]">{name}</div>
      <div className="h-4" />
      <div className="text-m-h3 font-bold leading-8">Invoices</div>
      <div className="h-4" />
      <InvoiceDetailsFallback />
    </div>
  )
}
