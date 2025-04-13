import { Link } from "react-router-dom"

export default function HomePage() {
  const cards = [
    {
      name: "Accounts",
      description: "Manage your accounts and account settings",
      icon: "👥",
      href: "/accounts",
      color: "bg-blue-500",
    },
    {
      name: "Users",
      description: "Manage users and their permissions",
      icon: "👤",
      href: "/users",
      color: "bg-green-500",
    },
    {
      name: "Organizations",
      description: "Manage organizations and their details",
      icon: "🏢",
      href: "/organizations",
      color: "bg-purple-500",
    },
    {
      name: "Contacts",
      description: "Manage contacts and their information",
      icon: "📇",
      href: "/contacts",
      color: "bg-pink-500",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Welcome to PingCRM
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Your modern CRM solution for managing contacts, organizations, and more.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.name}
              to={card.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <span
                  className={`inline-flex p-3 ${card.color} text-white rounded-lg ring-4 ring-white`}
                >
                  <span className="text-2xl">{card.icon}</span>
                </span>
                <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                  {card.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {card.description}
                </p>
              </div>
              <span
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
