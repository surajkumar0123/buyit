import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";

const store = configureStore({
  reducer: {
    auth: authReducer, // Use string key directly instead of `authSlice.name`
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
