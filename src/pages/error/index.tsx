import { useRouteError } from "react-router-dom"

export default function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
      <p className="text-xl text-gray-600 mb-8">Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-500">
        {error.statusText || error.message || "Unknown error"}
      </p>
    </div>
  )
}
