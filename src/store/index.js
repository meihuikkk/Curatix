import { createSlice, configureStore } from '@reduxjs/toolkit'

export const checkedModalSlice = createSlice({
  name: 'checkedModal',
  initialState: {
    value: null
  },
  reducers: {
    setModal:(state,action) => {
      state.value = action.payload
    }
  }
})

export const store = configureStore({
  reducer:checkedModalSlice.reducer
})

