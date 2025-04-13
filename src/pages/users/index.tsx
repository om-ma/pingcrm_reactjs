import { Link } from "react-router-dom"
import Table from "../../components/common/Table"
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../features/users/usersApiSlice"

export default function UsersPage() {
  const { data, isLoading, error } = useGetUsersQuery({ limit: 10 })
  const [deleteUser] = useDeleteUserMutation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading users</div>
  }

  const columns = [
    {
      header: "Name",
      accessor: (user: any) =>
        `${user.attributes.first_name} ${user.attributes.last_name}`,
    },
    {
      header: "Email",
      accessor: (user: any) => user.attributes.email,
    },
    {
      header: "Role",
      accessor: (user: any) => (user.attributes.owner ? "Owner" : "User"),
    },
    {
      header: "Created At",
      accessor: (user: any) =>
        new Date(user.attributes.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your organization.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/users/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add User
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <Table
          columns={columns}
          data={data?.data || []}
          basePath="/users"
          onDelete={(id) => {
            if (window.confirm("Are you sure you want to delete this user?")) {
              deleteUser(id)
            }
          }}
        />
      </div>
    </div>
  )
}
