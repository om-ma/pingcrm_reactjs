import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type Contact = {
  id: string
  type: string
  attributes: {
    first_name: string
    last_name: string
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
    organization: {
      data: {
        type: string
        id: string
      }
    }
  }
}

export type ContactsResponse = {
  data: Contact[]
  meta: {
    total: number
  }
  links: {
    self: string
    first: string
  }
}

export type SingleContactResponse = {
  data: Contact
  links: {
    self: string
  }
}

export type CreateContactRequest = {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  country: string
  postal_code: string
  account_id: number
  organization_id?: number
}

export const contactsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1" }),
  reducerPath: "contactsApi",
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    getContacts: builder.query<ContactsResponse, { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 10 }) => `/contacts?skip=${skip}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Contacts" as const, id })),
              { type: "Contacts", id: "LIST" },
            ]
          : [{ type: "Contacts", id: "LIST" }],
    }),
    getContact: builder.query<SingleContactResponse, string>({
      query: (id) => `/contacts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Contacts", id }],
    }),
    createContact: builder.mutation<SingleContactResponse, CreateContactRequest>({
      query: (body) => ({
        url: "/contacts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Contacts", id: "LIST" }],
    }),
    updateContact: builder.mutation<
      SingleContactResponse,
      { id: string; body: Partial<CreateContactRequest> }
    >({
      query: ({ id, body }) => ({
        url: `/contacts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Contacts", id },
        { type: "Contacts", id: "LIST" },
      ],
    }),
    deleteContact: builder.mutation<SingleContactResponse, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Contacts", id },
        { type: "Contacts", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApiSlice
