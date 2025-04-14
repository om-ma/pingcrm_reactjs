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
      accessor: (contact: any) => ({
        content: `${contact.attributes.first_name} ${contact.attributes.last_name}`,
        link: `/contacts/${contact.id}`,
      }),
    },
    {
      header: "Organization",
      accessor: (contact: any) => 
        contact.relationships.organization?.data ? {
          content: contact.relationships.organization.data.attributes?.name || 'N/A',
          link: `/organizations/${contact.relationships.organization.data.id}`,
        } : 'N/A',
    },
    {
      header: "Email",
      accessor: (contact: any) => contact.attributes.email || 'N/A',
    },
    {
      header: "Phone",
      accessor: (contact: any) => contact.attributes.phone || 'N/A',
    },
    {
      header: "City",
      accessor: (contact: any) => contact.attributes.city || 'N/A',
    },
    {
      header: "Created At",
      accessor: (contact: any) =>
        new Date(contact.attributes.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the contacts in your system including their name, organization, email, phone, and location.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/contacts/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Contact
          </Link>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <Table
                columns={columns}
                data={data?.data || []}
                onDelete={(id) => {
                  if (window.confirm("Are you sure you want to delete this contact?")) {
                    deleteContact(id)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
