import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: "users",
  initialState: {
    user: (() => {
      const user = localStorage.getItem("user");
      if (user && user !== "undefined") {
        try {
          return JSON.parse(user);
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
          return null;
        }
      }
      return null;
    })(),
  },
  
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});


export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
