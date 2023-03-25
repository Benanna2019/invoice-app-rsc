import { getDepositDetails } from '@/models/depositserver'
import invariant from 'tiny-invariant'
import { TrashIcon } from '@/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'

export default async function DepositRoute({ params }: { params: any }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return redirect('/login')
  }
  const { depositId } = params
  invariant(typeof depositId === 'string', 'params.depositId is not available')
  const depositDetails = await getDepositDetails(depositId)
  if (!depositDetails) {
    throw new Response('not found', { status: 404 })
  }

  const data = {
    depositNote: depositDetails.note,
  }

  return (
    <div className="p-8">
      <div className="flex justify-between">
        {data.depositNote ? (
          <span>
            Note:
            <br />
            <span className="pl-1">{data.depositNote}</span>
          </span>
        ) : (
          <span className="text-m-p-sm md:text-d-p-sm uppercase text-gray-500">
            No note
          </span>
        )}
        <div>
          <form method="DELETE" action="/api/deleteDeposit">
            <button
              type="submit"
              title="Delete deposit"
              name="intent"
              value="delete"
            >
              <TrashIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
