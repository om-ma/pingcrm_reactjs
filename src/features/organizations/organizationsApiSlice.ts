import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type Organization = {
  id: string
  type: string
  attributes: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    region: string
    country: string
    postal_code: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  relationships: {
    account: {
      data: {
        type: string
        id: string
      }
    }
  }
}

export type OrganizationsResponse = {
  data: Organization[]
  meta: {
    total: number
  }
  links: {
    self: string
    first: string
  }
}

export type SingleOrganizationResponse = {
  data: Organization
  links: {
    self: string
  }
}

export type CreateOrganizationRequest = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  country: string
  postal_code: string
  account_id: number
}

export const organizationsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1" }),
  reducerPath: "organizationsApi",
  tagTypes: ["Organizations"],
  endpoints: (builder) => ({
    getOrganizations: builder.query<
      OrganizationsResponse,
      { skip?: number; limit?: number }
    >({
      query: ({ skip = 0, limit = 10 }) =>
        `/organizations?skip=${skip}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Organizations" as const,
                id,
              })),
              { type: "Organizations", id: "LIST" },
            ]
          : [{ type: "Organizations", id: "LIST" }],
    }),
    getOrganization: builder.query<SingleOrganizationResponse, string>({
      query: (id) => `/organizations/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Organizations", id }],
    }),
    createOrganization: builder.mutation<
      SingleOrganizationResponse,
      CreateOrganizationRequest
    >({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Organizations", id: "LIST" }],
    }),
    updateOrganization: builder.mutation<
      SingleOrganizationResponse,
      { id: string; body: Partial<CreateOrganizationRequest> }
    >({
      query: ({ id, body }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Organizations", id },
        { type: "Organizations", id: "LIST" },
      ],
    }),
    deleteOrganization: builder.mutation<SingleOrganizationResponse, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Organizations", id },
        { type: "Organizations", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationsApiSlice
