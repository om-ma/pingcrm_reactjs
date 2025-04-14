import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useGetAccountQuery,
  useUpdateAccountMutation,
} from "../../features/accounts/accountsApiSlice"

export default function AccountDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: account, isLoading } = useGetAccountQuery(id!)
  const [updateAccount] = useUpdateAccountMutation()

  const [name, setName] = useState("")

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!account) {
    return <div>Account not found</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateAccount({
        id: id!,
        body: { name: name },
      }).unwrap()
      navigate("/accounts")
    } catch (err) {
      console.error("Failed to update account:", err)
    }
  }

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Account Information
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Edit your account details here.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={account.data.attributes.name}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
