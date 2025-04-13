import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type User = {
  id: string
  type: string
  attributes: {
    first_name: string
    last_name: string
    email: string
    owner: boolean
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

export type UsersResponse = {
  data: User[]
  meta: {
    total: number
  }
  links: {
    self: string
    first: string
  }
}

export type SingleUserResponse = {
  data: User
  links: {
    self: string
  }
}

export type CreateUserRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
  owner: boolean
}

export const usersApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1" }),
  reducerPath: "usersApi",
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 10 }) => `/users?skip=${skip}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUser: builder.query<SingleUserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    createUser: builder.mutation<SingleUserResponse, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body: {
          data: {
            type: "users",
            attributes: {
              first_name: body.firstName,
              last_name: body.lastName,
              email: body.email,
              password: body.password,
              owner: body.owner,
            },
          },
        },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation<
      SingleUserResponse,
      { id: string; body: Partial<CreateUserRequest> }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: {
          data: {
            type: "users",
            id,
            attributes: {
              ...(body.firstName && { first_name: body.firstName }),
              ...(body.lastName && { last_name: body.lastName }),
              ...(body.email && { email: body.email }),
              ...(body.password && { password: body.password }),
              ...(typeof body.owner === "boolean" && { owner: body.owner }),
            },
          },
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation<SingleUserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice
