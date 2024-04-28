import { configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "./chat/chatSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
