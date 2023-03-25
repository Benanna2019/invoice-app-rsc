import InvoicesPage from '@/components/invoice-page'
import { getInvoiceListItems } from '@/models/invoiceserver'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function InvoicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const invoiceListItems = await getInvoiceListItems()
  const dueSoonAmount = invoiceListItems.reduce((sum, li) => {
    if (li.dueStatus !== 'due') {
      return sum
    }
    const remainingBalance = li.totalAmount - li.totalDeposits
    return sum + remainingBalance
  }, 0)
  const overdueAmount = invoiceListItems.reduce((sum, li) => {
    if (li.dueStatus !== 'overdue') {
      return sum
    }
    const remainingBalance = li.totalAmount - li.totalDeposits
    return sum + remainingBalance
  }, 0)
  const data = {
    invoiceListItems,
    overdueAmount,
    dueSoonAmount,
  }

  const hundo = data.dueSoonAmount + data.overdueAmount
  const dueSoonPercent = Math.floor((data.dueSoonAmount / hundo) * 100)
  return (
    <InvoicesPage data={data} dueSoonPercent={dueSoonPercent}>
      {children}
    </InvoicesPage>
  )
}
