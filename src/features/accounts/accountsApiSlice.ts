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
  name: string
}

export const accountsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1" }),
  reducerPath: "accountsApi",
  tagTypes: ["Accounts"],
  endpoints: (builder) => ({
    getAccounts: builder.query<AccountsResponse, { limit?: number }>({
      query: ({ limit = 10 } = {}) => `/accounts?limit=${limit}`,
      providesTags: ["Accounts"],
    }),
    getAccount: builder.query<SingleAccountResponse, string>({
      query: (id) => `/accounts/${id}`,
      providesTags: ["Accounts"],
    }),
    createAccount: builder.mutation<SingleAccountResponse, CreateAccountRequest>({
      query: (account) => ({
        url: "/accounts",
        method: "POST",
        body: {
          data: {
            type: "accounts",
            attributes: {
              name: account.name,
            },
          },
        },
      }),
      invalidatesTags: ["Accounts"],
    }),
    updateAccount: builder.mutation<SingleAccountResponse, { id: string; account: Partial<CreateAccountRequest> }>({
      query: ({ id, account }) => ({
        url: `/accounts/${id}`,
        method: "PATCH",
        body: {
          data: {
            type: "accounts",
            id,
            attributes: {
              name: account.name,
            },
          },
        },
      }),
      invalidatesTags: ["Accounts"],
    }),
    deleteAccount: builder.mutation<SingleAccountResponse, string>({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Accounts"],
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
