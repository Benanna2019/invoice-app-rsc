import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'

import { Customer } from '@/models/customerserver'

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['customer'],
  endpoints: (builder) => ({
    search: builder.query<Customer[], string>({
      query: (q) => `search?name=${q}`,
      providesTags: (result, error, search) => [{ type: 'customer', search }],
    }),
  }),
})
