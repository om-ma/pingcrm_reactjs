import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useCreateAccountMutation, CreateAccountRequest } from "../../features/accounts/accountsApiSlice"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const accountSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-',.&]+$/, "Name can only contain letters, numbers, spaces, and basic punctuation"),
}) satisfies z.ZodType<CreateAccountRequest>

type AccountFormData = z.infer<typeof accountSchema>

export default function CreateAccountPage() {
  const navigate = useNavigate()
  const [createAccount] = useCreateAccountMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (data: AccountFormData) => {
    try {
      await createAccount({ name: data.name.trim() }).unwrap()
      navigate("/accounts")
    } catch (err: any) {
      if (err.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, message]) => {
          setError(field as keyof AccountFormData, {
            type: "manual",
            message: message as string,
          })
        })
      } else if (err.data?.detail) {
        setError("root", {
          type: "manual",
          message: err.data.detail,
        })
      } else {
        setError("root", {
          type: "manual",
          message: "An error occurred while creating the account",
        })
      }
    }
  }

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create Account
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Create a new account in the system.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                {errors.root && (
                  <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{errors.root.message}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                      placeholder="Account name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate("/accounts")}
                  className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
