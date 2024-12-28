import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginForm, UserData } from "../interfaces";

export const handleLogin = createAsyncThunk<UserData, LoginForm>(
  "Auth/handleLogin",
  async (apiData: LoginForm, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<UserData>(
        `http://localhost:3000/auth/signin`,
        apiData
      );
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
const initialState: {
  useData: UserData[];
} = {
  useData: []
};
const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(handleLogin.fulfilled, (state, { payload }) => {
      state.useData.push(payload);
    });
  }
})

export default AuthSlice.reducer;