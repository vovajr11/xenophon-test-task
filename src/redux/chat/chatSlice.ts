import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { sendMessage } from "./chatApi";

interface IChatData {
  id: number;
  content: string;
  type: string;
}

interface ChatState {
  data: IChatData[];
  loading: boolean;
  API_KEY: string;
}
const initialState: ChatState = { data: [], loading: false, API_KEY: "" };

export const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.API_KEY = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        const userMessage = {
          id: new Date().valueOf(),
          content: action.meta.arg,
          type: "request",
        };

        state.loading = true;
        state.data = [...state.data, userMessage];
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<any>) => {
        const resposeMessage = {
          id: new Date().valueOf(),
          content: action.payload.choices[0].message.content,
          type: "answer",
        };

        state.data = [...state.data, resposeMessage];
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action: PayloadAction<any>) => {
        const resposeMessage = {
          id: new Date().valueOf(),
          content: action.payload.error.message,
          type: "answer",
        };

        state.data = [...state.data, resposeMessage];
        state.loading = false;
      });
  },
});

export const { setApiKey } = chatSlice.actions;

export const getIsLoadingChat = (state: RootState) => state.chat.loading;
export const getChatHistory = (state: RootState) => state.chat.data;
