import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
  avatar?: {
    public_id: string;
    url: string;
  };
}

interface AuthState {
  user: User | null;
  loader: boolean;
}

const initialState: AuthState = {
  user: null,
  loader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
});

export default authSlice.reducer;
export const { userExists, userNotExists } = authSlice.actions;
