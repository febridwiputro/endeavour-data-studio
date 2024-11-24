// annotationsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AnnotationData } from "@/features/annotations/types";

interface AnnotationsState {
  annotations: AnnotationData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnnotationsState = {
  annotations: null,
  loading: false,
  error: null,
};

export const fetchAnnotations = createAsyncThunk(
  "annotations/fetchAnnotations",
  async () => {
    const response = await axios.get("http://0.0.0.0:8000/annotations/");
    return response.data.data as AnnotationData;
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

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchAnnotations = createAsyncThunk(
//   "annotations/fetchAnnotations",
//   async () => {
//     const response = await axios.get("http://0.0.0.0:8000/annotations/");
//     // Extract "Computer Vision" data from the response
//     const computerVisionData = response.data.data.features.find(
//       (feature: any) => feature.name === "Computer Vision"
//     );
//     return computerVisionData;
//   }
// );

// interface AnnotationState {
//   annotations: any[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AnnotationState = {
//   annotations: [],
//   loading: false,
//   error: null,
// };

// const annotationsSlice = createSlice({
//   name: "annotations",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAnnotations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAnnotations.fulfilled, (state, action) => {
//         state.loading = false;
//         state.annotations = action.payload?.sub_features_1 || [];
//       })
//       .addCase(fetchAnnotations.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to fetch annotations";
//       });
//   },
// });

// export default annotationsSlice.reducer;
