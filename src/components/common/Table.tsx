import { Link } from "react-router-dom"

type CellContent = {
  content: string
  link?: string
} | string

type Column<T> = {
  header: string
  accessor: (item: T) => CellContent
}

interface HasId {
  id: string | number
}

type TableProps<T extends HasId> = {
  columns: Column<T>[]
  data: T[]
  basePath?: string
  onDelete?: (id: string) => void
}

export default function Table<T extends HasId>({
  columns,
  data,
  basePath,
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
              {(onDelete || basePath) && (
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                {columns.map((column, colIndex) => {
                  const cellContent = column.accessor(item)
                  return (
                    <td
                      key={colIndex}
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                    >
                      {typeof cellContent === "string" ? (
                        cellContent
                      ) : cellContent.link ? (
                        <Link
                          to={cellContent.link}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {cellContent.content}
                        </Link>
                      ) : (
                        cellContent.content
                      )}
                    </td>
                  )
                })}
                {(onDelete || basePath) && (
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {basePath && (
                      <Link
                        to={`${basePath}/${item.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                      >
                        Edit
                      </Link>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(String(item.id))}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete<span className="sr-only">, {item.id}</span>
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
