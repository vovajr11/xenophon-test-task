import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

const url = "https://api.openai.com/v1/chat/completions";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (content: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const API_KEY = state.chat.API_KEY;

      const res = await axios.post(
        url,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: content }],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
