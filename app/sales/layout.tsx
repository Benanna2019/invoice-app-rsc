import SalesNav from '@/components/sales-nav'
import { getFirstCustomer } from '@/models/customerserver'
import { getFirstInvoice } from '@/models/invoiceserver'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }
  const [firstInvoice, firstCustomer] = await Promise.all([
    getFirstInvoice(),
    getFirstCustomer(),
  ])
  const data = {
    firstInvoiceId: firstInvoice?.id,
    firstCustomerId: firstCustomer?.id,
  }

  return (
    <>
      <SalesNav data={data}>{children}</SalesNav>
    </>
  )
}
