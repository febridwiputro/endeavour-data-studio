import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AnnotationData, AnnotationsState } from "./types";

const initialState: AnnotationsState = {
  annotations: null,
  loading: false,
  error: null,
};

export const fetchAnnotations = createAsyncThunk(
  "annotations/fetchAnnotations",
  async (): Promise<AnnotationData> => {
    const response = await axios.get("http://localhost:8000/annotations/");
    console.log("Fetched Annotations Data:", response.data.data);
    return response.data.data;
  }
);


const annotationsSlice = createSlice({
  name: "annotations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnotations.fulfilled, (state, action) => {
        state.loading = false;
        state.annotations = action.payload;
      })
      .addCase(fetchAnnotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch annotations";
      });
  },
});

export default annotationsSlice.reducer;
