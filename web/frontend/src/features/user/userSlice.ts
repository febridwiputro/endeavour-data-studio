import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState: UserState = {
  id: null,
  email: null,
  fullName: null,
  userPhoto: null,
  status: "idle",
  error: null,
};

// Async thunk to fetch user information
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("User is not logged in.");
      }
      const response = await axios.get("http://127.0.0.1:8000/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserData(state) {
      state.id = null;
      state.email = null;
      state.fullName = null;
      state.userPhoto = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.fullName = action.payload.full_name;
        state.userPhoto = action.payload.user_photo;
        state.status = "succeeded";
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearUserData } = userSlice.actions;

export default userSlice.reducer;
