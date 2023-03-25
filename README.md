# Invoice RSC App

## Port of Kent C Dodds invoice app to use React Server Components w/ Next app directory

Having used Remix for a year+ and with the more formal release of React Server Components with Nextjs app directory, I thought that it would be worth porting a comprehensive Remix app over to use Next App directory and RSC.

### Learnings

#### Nested Layouts

One of the main ideals of Remix is nested routing. The file convention in Nextjs app dir provides the ability for nested layouts as well.

A folder structure might look like this:

```
app/
    about/
        page.tsx
    sales/
        invoices/
                [invoiceId]
                    page.tsx   (This page will have layouts from root, sales, and invoices)
            layout.tsx          ------    --    --   --  ->    (This layout will inherit from)
            page.tsx                                                          |
        layout.tsx      (This layout will inherit from)            <---- (This one)
        page.tsx                      |
    layout.tsx          <-----   (This layout)
    page.tsx
```

_Apologies if the above is too cluttered_

#### Using html forms in Server Components

Along the way I wanted to use route handlers in the app/api folder

These are the new route handlers in the app directer that look like this:

```js
export async function GET() {
  // do some stuff
}

export async function POST() {
  // do other stuff
}
```

Being that "Server Components run on the server", and coming from Remix, I was wondering, "Can we use forms in Server Components like normal forms?

YES!! All you have to do is add an action to the form that sends to the api/some-handler and it works just like a normal form.

You don't have to `preventDefautl()` or anything. You can get all the formdata off of the request and it works perfectly.

Below is an example of a Server Component form and a handler that the form action is sending to.

_Server Component Form_

```jsx
<form method="POST" action="/api/createInvoice" className="flex flex-col gap-4">
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
    <input id="dueDate" name="dueDate" className={inputClasses} type="date" />
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
```

The `createInvoice` route handler

_all the code below comes from Kent's project in the FEM course. It was in a remix action function and we just moved it to a handler_

```js
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  const formData = await request.formData()
  const intent = formData.get('intent')
  switch (intent) {
    case 'create': {
      const customerId = formData.get('customerId')
      const dueDateString = formData.get('dueDate')
      invariant(typeof customerId === 'string', 'customerId is required')
      invariant(typeof dueDateString === 'string', 'dueDate is required')
      const dueDate = parseDate(dueDateString)

      const lineItemIds = formData.getAll('lineItemId')
      const lineItemQuantities = formData.getAll('quantity')
      const lineItemUnitPrices = formData.getAll('unitPrice')
      const lineItemDescriptions = formData.getAll('description')
      const lineItems: Array<LineItemFields> = []
      for (let i = 0; i < lineItemQuantities.length; i++) {
        const quantity = +lineItemQuantities[i]
        const unitPrice = +lineItemUnitPrices[i]
        const description = lineItemDescriptions[i]
        invariant(typeof quantity === 'number', 'quantity is required')
        invariant(typeof unitPrice === 'number', 'unitPrice is required')
        invariant(typeof description === 'string', 'description is required')

        lineItems.push({ quantity, unitPrice, description })
      }

      const errors = {
        customerId: validateCustomerId(customerId),
        dueDate: validateDueDate(dueDate),
        lineItems: lineItems.reduce((acc, lineItem, index) => {
          const id = lineItemIds[index]
          invariant(typeof id === 'string', 'lineItem ids are required')
          acc[id] = {
            quantity: validateLineItemQuantity(lineItem.quantity),
            unitPrice: validateLineItemUnitPrice(lineItem.unitPrice),
          }
          return acc
        }, {} as Record<string, { quantity: null | string; unitPrice: null | string }>),
      }

      const customerIdHasError = errors.customerId !== null
      const dueDateHasError = errors.dueDate !== null
      const lineItemsHaveErrors = Object.values(errors.lineItems).some(
        (lineItem) => Object.values(lineItem).some(Boolean),
      )
      const hasErrors =
        dueDateHasError || customerIdHasError || lineItemsHaveErrors

      if (hasErrors) {
        return NextResponse.json({ errors, status: 400 })
      }

      const invoice = await createInvoice({ dueDate, customerId, lineItems })

      return redirect(`/sales/invoices/${invoice.id}`)
    }
  }
  return new Response(`Unsupported intent: ${intent}`, { status: 400 })
}
```

#### Other learnings

- If you have a layout route and a page route in a directory and the page route only serves to render its children `return <>{children}</>`, the page cannot be a Server Component. You will get an error like `cannot read Json of undefined`. I don't claim to know what's happening but changing it to be a client component with `'use client'` fixed the issue.

  - You also have to have a page.tsx for a route. Meaning, you cannot just have a layout.tsx file and pass it children. The page has to exist. I think this makes sense in that you cannot have child routes of a nonexistent page

- If you import anything from a server component into a client component, like type interfaces for example, your component will not work. You have to keep the separated from each other.

  - You can pass anything as props from server to client but you cannot import anything from server to client

- Next auth is awesome for the app dir. I ended up, for this project, using next auth and planetscale.
  - On that note, I could not get next auth to work with `app/api/[...nextauth].ts`. I still had to use `pages/api/[...nextauth].ts`
# invoice-app-rsc
