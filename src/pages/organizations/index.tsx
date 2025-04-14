import { Link } from "react-router-dom"
import Table from "../../components/common/Table"
import {
  useDeleteOrganizationMutation,
  useGetOrganizationsQuery,
} from "../../features/organizations/organizationsApiSlice"

export default function OrganizationsPage() {
  const { data, isLoading, error } = useGetOrganizationsQuery({ limit: 10 })
  const [deleteOrganization] = useDeleteOrganizationMutation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading organizations</div>
  }

  const columns = [
    {
      header: "Name",
      accessor: (org: any) => org.attributes.name,
    },
    {
      header: "Email",
      accessor: (org: any) => org.attributes.email,
    },
    {
      header: "Phone",
      accessor: (org: any) => org.attributes.phone,
    },
    {
      header: "City",
      accessor: (org: any) => org.attributes.city,
    },
    {
      header: "Created At",
      accessor: (org: any) =>
        new Date(org.attributes.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Organizations</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the organizations in your system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/organizations/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Organization
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <Table
          columns={columns}
          data={data?.data || []}
          basePath="/organizations"
          onDelete={(id) => {
            if (
              window.confirm("Are you sure you want to delete this organization?")
            ) {
              deleteOrganization(id)
            }
          }}
        />
      </div>
    </div>
  )
}
