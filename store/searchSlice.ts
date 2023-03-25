import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Customer } from '@/models/customerserver'

export interface SearchState {
  search: string
  startupCustomers: Customer[]
}

const initialState: SearchState = {
  search: '',
  startupCustomers: [],
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setStartupCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.startupCustomers = action.payload
    },
  },
})

export const { setSearch, setStartupCustomers } = searchSlice.actions
export default searchSlice.reducer
