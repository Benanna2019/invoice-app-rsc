'use client'

import { useId, useState } from 'react'
import { PlusIcon, MinusIcon, LabelText, inputClasses } from '..'

const generateRandomId = () => Math.random().toString(32).slice(2)

export default function LineItems() {
  const firstId = useId()
  const [lineItems, setLineItems] = useState(() => [firstId])
  return (
    <div className="flex flex-col gap-2">
      {lineItems.map((lineItemClientId, index) => (
        <LineItemFormFields
          key={lineItemClientId}
          lineItemClientId={lineItemClientId}
          index={index}
          onRemoveClick={() => {
            setLineItems((lis) =>
              lis.filter((id, i) => id !== lineItemClientId),
            )
          }}
        />
      ))}
      <div className="mt-3 text-right">
        <button
          title="Add Line Item"
          type="button"
          onClick={() => setLineItems((lis) => [...lis, generateRandomId()])}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  )
}

function LineItemFormFields({
  lineItemClientId,
  index,
  onRemoveClick,
}: {
  lineItemClientId: string
  index: number
  onRemoveClick: () => void
}) {
  return (
    <fieldset key={lineItemClientId} className="border-b-2 py-2">
      <div className="flex gap-2">
        <button type="button" title="Remove Line Item" onClick={onRemoveClick}>
          <MinusIcon />
        </button>
        <legend>Line Item {index + 1}</legend>
      </div>
      <input value={lineItemClientId} name="lineItemId" type="hidden" />
      <div className="flex flex-col gap-1">
        <div className="flex w-full gap-2">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1">
              <LabelText>
                <label htmlFor={`quantity-${lineItemClientId}`}>
                  Quantity:
                </label>
              </LabelText>
              {/* {errors?.quantity ? (
                <em id="quantity-error" className="text-d-p-xs text-red-600">
                  {errors.quantity}
                </em>
              ) : null} */}
            </div>
            <input
              id={`quantity-${lineItemClientId}`}
              name="quantity"
              type="number"
              className={inputClasses}
              //   aria-invalid={Boolean(errors?.quantity) || undefined}
              //   aria-errormessage={errors?.quantity ? 'name-error' : undefined}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1">
              <LabelText>
                <label htmlFor={`unitPrice-${lineItemClientId}`}>
                  Unit Price:
                </label>
              </LabelText>
              {/* {errors?.unitPrice ? (
                <em id="unitPrice-error" className="text-d-p-xs text-red-600">
                  {errors.unitPrice}
                </em>
              ) : null} */}
            </div>
            <input
              id={`unitPrice-${lineItemClientId}`}
              name="unitPrice"
              type="number"
              min="1"
              step="any"
              className={inputClasses}
              //   aria-invalid={Boolean(errors?.unitPrice) || undefined}
              //   aria-errormessage={errors?.unitPrice ? 'name-error' : undefined}
            />
          </div>
        </div>
        <div>
          <LabelText>
            <label htmlFor={`description-${lineItemClientId}`}>
              Description:
            </label>
          </LabelText>
          <input
            id={`description-${lineItemClientId}`}
            name="description"
            className={inputClasses}
          />
        </div>
      </div>
    </fieldset>
  )
}
