import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "../../config/env"

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
  postalCode: string
}

export const organizationsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  reducerPath: "organizationsApi",
  tagTypes: ["Organizations"],
  endpoints: (builder) => ({
    getOrganizations: builder.query<OrganizationsResponse, { limit?: number }>({
      query: ({ limit = 10 } = {}) => `/organizations?limit=${limit}`,
      providesTags: ["Organizations"],
    }),
    getOrganization: builder.query<SingleOrganizationResponse, string>({
      query: (id) => `/organizations/${id}`,
      providesTags: ["Organizations"],
    }),
    createOrganization: builder.mutation<SingleOrganizationResponse, CreateOrganizationRequest>({
      query: (organization) => ({
        url: "/organizations",
        method: "POST",
        body: {
          data: {
            type: "organizations",
            attributes: {
              name: organization.name,
              email: organization.email,
              phone: organization.phone,
              address: organization.address,
              city: organization.city,
              region: organization.region,
              country: organization.country,
              postal_code: organization.postalCode,
            },
          },
        },
      }),
      invalidatesTags: ["Organizations"],
    }),
    updateOrganization: builder.mutation<
      SingleOrganizationResponse,
      { id: string; body: Partial<CreateOrganizationRequest> }
    >({
      query: ({ id, body }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        body: {
          data: {
            type: "organizations",
            id,
            attributes: body,
          },
        },
      }),
      invalidatesTags: ["Organizations"],
    }),
    deleteOrganization: builder.mutation<SingleOrganizationResponse, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organizations"],
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
