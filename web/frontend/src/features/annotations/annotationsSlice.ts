import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/apiConfig"; // Import Axios instance

// Define the shape of the state
interface PredictionResult {
  class_id: number;
  class_name: string;
  bounding_box: { x1: number; y1: number; x2: number; y2: number };
  confidence: number;
}

interface AnnotationData {
  id: number;
  name: string;
  details: string;
}

interface AnnotationsState {
  apiStatus: "idle" | "loading" | "success" | "error";
  apiMessage: string | null;
  predictionResults: PredictionResult[] | null;
  annotations: AnnotationData[] | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AnnotationsState = {
  apiStatus: "idle",
  apiMessage: null,
  predictionResults: null,
  annotations: null,
  loading: false,
  error: null,
};

// Async thunk to test API connection
export const testApiConnection = createAsyncThunk(
  "annotations/testApiConnection",
  async () => {
    const response = await api.get("/yolo"); // Gunakan api instance
    return response.data.message;
  }
);

export const predictImage = createAsyncThunk(
  "annotations/predictImage",
  async (formData: FormData): Promise<PredictionResult[]> => {
    try {
      const response = await api.post("/yolo/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Pastikan format benar
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Prediction failed.");
    }
  }
);

// Async thunk to fetch annotations
export const fetchAnnotations = createAsyncThunk(
  "annotations/fetchAnnotations",
  async (): Promise<AnnotationData[]> => {
    const response = await api.get("/annotations/"); // Gunakan api instance
    return response.data.data;
  }
);

// Create slice
const annotationsSlice = createSlice({
  name: "annotations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Test API connection
      .addCase(testApiConnection.pending, (state) => {
        state.apiStatus = "loading";
        state.apiMessage = null;
      })
      .addCase(testApiConnection.fulfilled, (state, action) => {
        state.apiStatus = "success";
        state.apiMessage = action.payload;
      })
      .addCase(testApiConnection.rejected, (state) => {
        state.apiStatus = "error";
        state.apiMessage = "Failed to connect to the API.";
      })
      // Predict Image
      .addCase(predictImage.pending, (state) => {
        state.loading = true;
        state.predictionResults = null;
      })
      .addCase(predictImage.fulfilled, (state, action) => {
        state.loading = false;
        state.predictionResults = action.payload;
      })
      .addCase(predictImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Prediction failed.";
      })
      // Fetch Annotations
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
        state.error = action.error.message || "Failed to fetch annotations.";
      });
  },
});

export default annotationsSlice.reducer;