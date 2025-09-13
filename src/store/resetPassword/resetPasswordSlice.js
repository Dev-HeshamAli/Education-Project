import { createSlice } from '@reduxjs/toolkit';

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    email: '',
    code: '',
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setCode(state, action) {
      state.code = action.payload;
    },
  }
});

export const { setEmail, setCode } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
