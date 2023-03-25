import { inputClasses, LabelText, submitButtonClasses } from '@/components'

export default function NewCustomer() {
  return (
    <div className="relative p-10">
      <h2 className="font-display mb-4">New Customer</h2>
      <form
        method="post"
        action="/api/customerActions"
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="name">
            <LabelText>Name</LabelText>
          </label>
          <input id="name" name="name" className={inputClasses} type="text" />
        </div>
        <div>
          <label htmlFor="email">
            <LabelText>Email</LabelText>
          </label>
          <input
            id="email"
            name="email"
            className={inputClasses}
            type="email"
          />
        </div>

        <div>
          <button
            type="submit"
            name="intent"
            value="create"
            className={submitButtonClasses}
          >
            Create Customer
          </button>
        </div>
      </form>
    </div>
  )
}
