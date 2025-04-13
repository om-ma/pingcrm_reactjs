import { Link } from "react-router-dom"
import Table from "../../components/common/Table"
import {
  useDeleteAccountMutation,
  useGetAccountsQuery,
} from "../../features/accounts/accountsApiSlice"

export default function AccountsPage() {
  const { data, isLoading, error } = useGetAccountsQuery({ limit: 10 })
  const [deleteAccount] = useDeleteAccountMutation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading accounts</div>
  }

  const columns = [
    {
      header: "Name",
      accessor: (account: any) => account.attributes.name,
    },
    {
      header: "Created At",
      accessor: (account: any) =>
        new Date(account.attributes.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Accounts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the accounts in your organization.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/accounts/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Account
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <Table
          columns={columns}
          data={data?.data || []}
          basePath="/accounts"
          onDelete={(id) => {
            if (window.confirm("Are you sure you want to delete this account?")) {
              deleteAccount(id)
            }
          }}
        />
      </div>
    </div>
  )
}
