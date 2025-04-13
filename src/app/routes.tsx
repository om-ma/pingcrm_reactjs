import { createBrowserRouter } from "react-router-dom"
import RootLayout from "../components/layouts/RootLayout"
import HomePage from "../pages/home"
import AccountsPage from "../pages/accounts"
import AccountDetailsPage from "../pages/accounts/[id]"
import CreateAccountPage from "../pages/accounts/create"
import UsersPage from "../pages/users"
import UserDetailsPage from "../pages/users/[id]"
import CreateUserPage from "../pages/users/create"
import OrganizationsPage from "../pages/organizations"
import OrganizationDetailsPage from "../pages/organizations/[id]"
import ContactsPage from "../pages/contacts"
import ContactDetailsPage from "../pages/contacts/[id]"
import ErrorPage from "../pages/error"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "accounts",
        children: [
          { index: true, element: <AccountsPage /> },
          { path: "create", element: <CreateAccountPage /> },
          { path: ":id", element: <AccountDetailsPage /> },
        ],
      },
      {
        path: "users",
        children: [
          { index: true, element: <UsersPage /> },
          { path: "create", element: <CreateUserPage /> },
          { path: ":id", element: <UserDetailsPage /> },
        ],
      },
      {
        path: "organizations",
        children: [
          { index: true, element: <OrganizationsPage /> },
          { path: ":id", element: <OrganizationDetailsPage /> },
        ],
      },
      {
        path: "contacts",
        children: [
          { index: true, element: <ContactsPage /> },
          { path: ":id", element: <ContactDetailsPage /> },
        ],
      },
    ],
  },
])
