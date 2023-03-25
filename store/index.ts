import { configureStore } from '@reduxjs/toolkit'

import searchReducer from './searchSlice'
import { customerApi } from './customerApi'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    customerApi: customerApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(customerApi.middleware)
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
