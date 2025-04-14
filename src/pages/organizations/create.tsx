import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { useCreateOrganizationMutation, CreateOrganizationRequest } from "../../features/organizations/organizationsApiSlice"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const organizationSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-',.&]+$/, "Name can only contain letters, numbers, spaces, and basic punctuation"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Phone number must be in E.164 format (e.g., +1234567890)"),
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s\-',.#&]+$/, "Address can only contain letters, numbers, spaces, and basic punctuation"),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "City can only contain letters, spaces, hyphens and apostrophes"),
  region: z.string()
    .min(2, "State/Province must be at least 2 characters")
    .max(100, "State/Province must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "State/Province can only contain letters, spaces, hyphens and apostrophes"),
  country: z.string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "Country can only contain letters, spaces, hyphens and apostrophes"),
  postalCode: z.string()
    .min(3, "Postal code must be at least 3 characters")
    .max(20, "Postal code must be less than 20 characters")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Postal code can only contain letters, numbers, spaces, and hyphens"),
}) satisfies z.ZodType<CreateOrganizationRequest>

type OrganizationFormData = z.infer<typeof organizationSchema>

export default function CreateOrganizationPage() {
  const navigate = useNavigate()
  const [createOrganization] = useCreateOrganizationMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      country: "",
      postalCode: "",
    },
  })

  const onSubmit: SubmitHandler<OrganizationFormData> = async (data) => {
    try {
      const formData: CreateOrganizationRequest = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        region: data.region.trim(),
        country: data.country.trim(),
        postalCode: data.postalCode.trim(),
      }
      await createOrganization(formData).unwrap()
      navigate("/organizations")
    } catch (err: any) {
      if (err.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, message]) => {
          setError(field as keyof OrganizationFormData, {
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
          message: "An error occurred while creating the organization",
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
              Create Organization
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Add a new organization to your system.
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
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      placeholder="+1234567890"
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.phone
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      {...register("address")}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.address
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register("city")}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.city
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="region"
                      {...register("region")}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.region
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.region && (
                      <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP / Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      {...register("postalCode")}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.postalCode
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      {...register("country")}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.country
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate("/organizations")}
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
