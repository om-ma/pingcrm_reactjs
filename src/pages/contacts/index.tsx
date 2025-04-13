import { Link } from "react-router-dom"
import Table from "../../components/common/Table"
import {
  useDeleteContactMutation,
  useGetContactsQuery,
} from "../../features/contacts/contactsApiSlice"

export default function ContactsPage() {
  const { data, isLoading, error } = useGetContactsQuery({ limit: 10 })
  const [deleteContact] = useDeleteContactMutation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading contacts</div>
  }

  const columns = [
    {
      header: "Name",
      accessor: (contact: any) =>
        `${contact.attributes.first_name} ${contact.attributes.last_name}`,
    },
    {
      header: "Organization",
      accessor: (contact: any) => contact.relationships.organization.data.id,
    },
    {
      header: "Email",
      accessor: (contact: any) => contact.attributes.email,
    },
    {
      header: "Phone",
      accessor: (contact: any) => contact.attributes.phone,
    },
    {
      header: "City",
      accessor: (contact: any) => contact.attributes.city,
    },
    {
      header: "Created At",
      accessor: (contact: any) =>
        new Date(contact.attributes.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the contacts in your system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/contacts/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Contact
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <Table
          columns={columns}
          data={data?.data || []}
          basePath="/contacts"
          onDelete={(id) => {
            if (window.confirm("Are you sure you want to delete this contact?")) {
              deleteContact(id)
            }
          }}
        />
      </div>
    </div>
  )
}
