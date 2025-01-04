import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiConfig";

// Async thunk to fetch upload data by project data ID
export const fetchUploadDataByProjectData = createAsyncThunk(
  "projectUploads/fetchByProjectData",
  async (dataId: number) => {
    const response = await api.get(`/annotations//upload-data/${dataId}`);
    return response.data;
  }
);

// Async thunk to create a new upload entry
export const createUploadData = createAsyncThunk(
  "projectUploads/create",
  async (newUpload: { data_id: number; file_name: string }) => {
    const response = await api.post(`/annotations//upload-data`, newUpload);
    return response.data;
  }
);

const annotationProjectUploadDataSlice = createSlice({
  name: "projectUploads",
  initialState: {
    uploads: [] as Array<{
      id: number;
      data_id: number;
      file_name: string;
      created_at: string;
      created_by: number;
    }>,
    status: "idle", // loading, succeeded, failed
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Upload Data
      .addCase(fetchUploadDataByProjectData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUploadDataByProjectData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.uploads = action.payload;
      })
      .addCase(fetchUploadDataByProjectData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch upload data.";
      })

      // Create Upload Data
      .addCase(createUploadData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUploadData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.uploads.push(action.payload); // Add the new upload to the state
      })
      .addCase(createUploadData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create upload data.";
      });
  },
});

export default annotationProjectUploadDataSlice.reducer;
