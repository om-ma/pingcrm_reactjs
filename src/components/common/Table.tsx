import { Link } from "react-router-dom"

type Column<T> = {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  basePath: string
  idField?: keyof T
  onDelete?: (id: string) => void
}

export default function Table<T>({
  columns,
  data,
  basePath,
  idField = "id" as keyof T,
  onDelete,
}: TableProps<T>) {
  return (
    <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  {column.header}
                </th>
              ))}
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"
                  >
                    {typeof column.accessor === "function"
                      ? column.accessor(item)
                      : (item[column.accessor] as React.ReactNode)}
                  </td>
                ))}
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link
                    to={`${basePath}/${item[idField]}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(String(item[idField]))}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
