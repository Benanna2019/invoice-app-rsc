import { getCustomerListItems } from '@/models/customerserver'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import CustomerLayout from '@/components/customer-layout'
import { redirect } from 'next/navigation'

export default async function CustomersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerSession(authOptions)
  if (!user) {
    redirect('/login')
  }
  const customers = await getCustomerListItems()

  return <CustomerLayout customers={customers}>{children}</CustomerLayout>
}
