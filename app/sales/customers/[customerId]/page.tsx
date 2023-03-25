import invariant from 'tiny-invariant'
import { getCustomerDetails, getCustomerInfo } from '@/models/customerserver'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import CustomerIdPage from '@/components/customer-id-page'

export default async function CustomerIdLayout({ params }: { params: any }) {
  const user = await getServerSession(authOptions)
  if (!user) {
    redirect('/login')
  }
  const { customerId } = params
  invariant(
    typeof customerId === 'string',
    'params.customerId is not available',
  )
  const customerInfo = await getCustomerInfo(customerId)
  if (!customerInfo) {
    throw new Response('not found', { status: 404 })
  }
  const customerDetails = await getCustomerDetails(customerId)

  const data = { customerInfo, customerDetails }

  return <CustomerIdPage data={data} />
}
