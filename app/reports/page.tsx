import { inputClasses, submitButtonClasses } from '@/components'

export default function ReportsRoute() {
  return (
    <div className="relative h-full p-10">
      <h1 className="font-display text-d-h3 text-black">Reports</h1>
      <div className="h-6" />
      <div className="flex gap-4 border-b border-gray-100 pb-4 text-[length:14px] font-medium">
        <form className="margin-auto flex justify-center gap-4">
          <div>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className={inputClasses}
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className={submitButtonClasses}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
