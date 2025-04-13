import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type Account = {
  id: string
  type: string
  attributes: {
    name: string
    created_at: string
    updated_at: string
  }
}

export type AccountsResponse = {
  data: Account[]
  meta: {
    total: number
  }
  links: {
    self: string
    first: string
  }
}

export type SingleAccountResponse = {
  data: Account
  links: {
    self: string
  }
}

export type CreateAccountRequest = {
  data: {
    type: string
    attributes: {
      name: string
    }
  }
}

export const accountsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1" }),
  reducerPath: "accountsApi",
  tagTypes: ["Accounts"],
  endpoints: (builder) => ({
    getAccounts: builder.query<AccountsResponse, { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 10 }) => `/accounts?skip=${skip}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Accounts" as const, id })),
              { type: "Accounts", id: "LIST" },
            ]
          : [{ type: "Accounts", id: "LIST" }],
    }),
    getAccount: builder.query<SingleAccountResponse, string>({
      query: (id) => `/accounts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Accounts", id }],
    }),
    createAccount: builder.mutation<SingleAccountResponse, { name: string }>({
      query: ({ name }) => ({
        url: "/accounts",
        method: "POST",
        body: {
          data: {
            type: "accounts",
            attributes: {
              name,
            },
          },
        },
      }),
      invalidatesTags: [{ type: "Accounts", id: "LIST" }],
    }),
    updateAccount: builder.mutation<
      SingleAccountResponse,
      { id: string; body: { name: string } }
    >({
      query: ({ id, body }) => ({
        url: `/accounts/${id}`,
        method: "PUT",
        body: {
          data: {
            type: "accounts",
            id,
            attributes: {
              name: body.name,
            },
          },
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Accounts", id },
        { type: "Accounts", id: "LIST" },
      ],
    }),
    deleteAccount: builder.mutation<SingleAccountResponse, string>({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Accounts", id },
        { type: "Accounts", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetAccountsQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountsApiSlice
