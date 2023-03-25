import { inputClasses, LabelText, submitButtonClasses } from '@/components'
// import { CustomerCombobox } from "@/app/resources/customers";
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getCustomerListItems } from '@/models/customerserver'
import LineItems from '@/components/invoice-line-items'

export function validateCustomerId(customerId: string) {
  // the database won't let us create an invoice without a customer
  // so all we need to do is make sure this is not an empty string
  return customerId === '' ? 'Please select a customer' : null
}

export function validateDueDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return 'Please enter a valid date'
  }
  return null
}

export function validateLineItemQuantity(quantity: number) {
  if (quantity <= 0) return 'Must be greater than 0'
  if (Number(quantity.toFixed(0)) !== quantity) {
    return 'Fractional quantities are not allowed'
  }
  return null
}

export function validateLineItemUnitPrice(unitPrice: number) {
  if (unitPrice <= 0) return 'Must be greater than 0'
  if (Number(unitPrice.toFixed(2)) !== unitPrice) {
    return 'Must only have two decimal places'
  }
  return null
}

export default async function NewInvoice() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return redirect('/login')
  }
  const customers = await getCustomerListItems()
  return (
    <div className="relative p-10">
      <h2 className="font-display mb-4">New Invoice</h2>
      <form
        method="POST"
        action="/api/createInvoice"
        className="flex flex-col gap-4"
      >
        {/* <CustomerCombobox error={actionData?.errors.customerId} /> */}
        <div className="relative">
          <div className="flex flex-wrap items-center gap-1">
            <label htmlFor="customers">
              <LabelText>Customer</LabelText>
            </label>
            <select name="customerId" id="customerId">
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Replace all bracketed content with the combobox once that's figured out */}
        <div>
          <div className="flex flex-wrap items-center gap-1">
            <label htmlFor="dueDate">
              <LabelText>Due Date</LabelText>
            </label>
          </div>
          <input
            id="dueDate"
            name="dueDate"
            className={inputClasses}
            type="date"
          />
        </div>
        <LineItems />
        <div>
          <button
            type="submit"
            name="intent"
            value="create"
            className={submitButtonClasses}
          >
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  )
}
