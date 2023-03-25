import { createCustomer } from '@/models/customerserver'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import invariant from 'tiny-invariant'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const intent = formData.get('intent')
  switch (intent) {
    case 'create': {
      const name = formData.get('name')
      const email = formData.get('email')
      invariant(typeof name === 'string', 'name is required')
      invariant(typeof email === 'string', 'email is required')

      const customer = await createCustomer({ name, email })

      return redirect(`/sales/customers/${customer.id}`)
    }
  }
  return new Response(`Unsupported intent: ${intent}`, { status: 400 })
}
