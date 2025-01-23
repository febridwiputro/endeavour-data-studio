import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/apiConfig";

// Async thunk to create a new annotation project
export const createAnnotationProject = createAsyncThunk(
  "projectAnnotations/create",
  async (newProject: {
    name: string;
    description?: string;
    project_photo_url?: string;
    sub_feature_2_id?: number;
  }) => {
    const response = await api.post(
      "/annotations/annotation-projects",
      newProject
    );
    return response.data;
  }
);

export const fetchAllAnnotations = createAsyncThunk(
  "projectAnnotations/fetchAll",
  async () => {
    const response = await api.get("/annotations/annotations");
    return response.data;
  }
);

export const fetchProjectAnnotationsByType = createAsyncThunk(
  "projectAnnotations/fetchByType",
  async (codeName: string) => {
    const response = await api.get(
      `/annotations/annotation-projects/by-feature-code/${codeName}`
    );
    return response.data;
  }
);

export const fetchAnnotationFeatures = createAsyncThunk(
  "projectAnnotations/fetchFeatures",
  async () => {
    const response = await api.get("/annotations/annotation-features");
    return response.data;
  }
);

// Fetch Sub Features 1
export const fetchSubFeatures1 = createAsyncThunk(
  "projectAnnotations/fetchSubFeatures1",
  async () => {
    const response = await api.get("/annotations/sub-features-1");
    return response.data;
  }
);

// Fetch Sub Features 1 by Feature ID
export const fetchSubFeatures1ByFeature = createAsyncThunk(
  "projectAnnotations/fetchSubFeatures1ByFeature",
  async (featureId: number) => {
    const response = await api.get(
      `/annotations/sub-feature1/by-feature/${featureId}`
    );
    return response.data;
  }
);

// Fetch Sub Features 2
export const fetchSubFeatures2 = createAsyncThunk(
  "projectAnnotations/fetchSubFeatures2",
  async () => {
    const response = await api.get("/annotations/sub-features-2");
    return response.data;
  }
);

// Fetch Sub Features 2 by Sub Feature 1 ID
export const fetchSubFeatures2BySubFeature1 = createAsyncThunk(
  "projectAnnotations/fetchSubFeatures2BySubFeature1",
  async (subFeature1Id: number) => {
    const response = await api.get(
      `/annotations/sub-feature2/by-sub-feature1/${subFeature1Id}`
    );
    return response.data;
  }
);

const projectAnnotationSlice = createSlice({
  name: "projectAnnotations",
  initialState: {
    annotations: [] as Array<{
      id: number;
      name: string;
      project_photo_url?: string;
      sub_feature_2_id?: number;
    }>,
    annotationFeatures: [] as Array<{
      id: number;
      name: string;
      code_name: string;
      logo_url: string;
      description?: string;
    }>,
    subAnnotationFeatures1: [] as Array<{
      id: number;
      name: string;
      description: string;
      feature_id: number;
      created_by: number;
      created_at: string;
    }>,
    subAnnotationFeatures1ByFeature: [] as Array<{
      id: number;
      name: string;
      description: string;
      feature_id: number;
    }>,
    subAnnotationFeatures2: [] as Array<{
      id: number;
      name: string;
      description: string;
      sub_feature_1_id: number;
      created_by: number;
      created_at: string;
    }>,
    subAnnotationFeatures2BySubFeature1: [] as Array<{
      id: number;
      name: string;
      description: string;
      sub_feature_1_id: number;
    }>,
    dataCount: 0,
    selectedAnnotation: null as {
      id: number;
      name: string;
      project_photo_url?: string;
      annotation_type?: string;
      code_name?: string;
    } | null,
    status: "idle",
    creationStatus: "idle",
    creationError: null as string | null,
  },
  reducers: {
    setSelectedAnnotation: (state, action: PayloadAction<any>) => {
      state.selectedAnnotation = action.payload; // ✅ Menyimpan selectedAnnotation ke Redux state
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Annotations By Type
      .addCase(fetchProjectAnnotationsByType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjectAnnotationsByType.fulfilled, (state, action) => {
        state.annotations = action.payload.data;
        state.dataCount = action.payload.data_count;
        state.status = "succeeded";
      })
      .addCase(fetchProjectAnnotationsByType.rejected, (state) => {
        state.status = "failed";
      })

      // Fetch All Annotations
      .addCase(fetchAllAnnotations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllAnnotations.fulfilled, (state, action) => {
        state.annotations = action.payload.data;
        state.dataCount = action.payload.data_count;
        state.status = "succeeded";
      })
      .addCase(fetchAllAnnotations.rejected, (state) => {
        state.status = "failed";
      })

      // Fetch Annotation Features
      .addCase(fetchAnnotationFeatures.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnnotationFeatures.fulfilled, (state, action) => {
        state.annotationFeatures = action.payload.data;
        state.status = "succeeded";
      })
      .addCase(fetchAnnotationFeatures.rejected, (state) => {
        state.status = "failed";
      })

      // Fetch Sub Features 1
      .addCase(fetchSubFeatures1.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubFeatures1.fulfilled, (state, action) => {
        state.subAnnotationFeatures1 = action.payload.data;
        state.dataCount = action.payload.data_count;
        state.status = "succeeded";
      })
      .addCase(fetchSubFeatures1.rejected, (state) => {
        state.status = "failed";
      })

      // Fetch Sub Features 1 by Feature
      .addCase(fetchSubFeatures1ByFeature.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubFeatures1ByFeature.fulfilled, (state, action) => {
        state.subAnnotationFeatures1ByFeature = action.payload.data;
        state.status = "succeeded";
      })
      .addCase(fetchSubFeatures1ByFeature.rejected, (state) => {
        state.status = "failed";
      })

      // Fetch Sub Features 2
      .addCase(fetchSubFeatures2.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubFeatures2.fulfilled, (state, action) => {
        state.subAnnotationFeatures2 = action.payload.data;
        state.dataCount = action.payload.data_count;
        state.status = "succeeded";
      })
      .addCase(fetchSubFeatures2.rejected, (state) => {
        state.status = "failed";
      })

      // Fetch Sub Features 2 by Sub Feature 1
      .addCase(fetchSubFeatures2BySubFeature1.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubFeatures2BySubFeature1.fulfilled, (state, action) => {
        state.subAnnotationFeatures2BySubFeature1 = action.payload.data;
        state.status = "succeeded";
      })
      .addCase(fetchSubFeatures2BySubFeature1.rejected, (state) => {
        state.status = "failed";
      })

      // Create Annotation Project
      .addCase(createAnnotationProject.pending, (state) => {
        state.creationStatus = "loading";
        state.creationError = null;
      })
      .addCase(createAnnotationProject.fulfilled, (state, action) => {
        state.annotations.push(action.payload.data);
        state.creationStatus = "succeeded";
        state.dataCount += 1;
      })
      .addCase(createAnnotationProject.rejected, (state, action) => {
        state.creationStatus = "failed";
        state.creationError =
          action.error.message || "Failed to create project.";
      });
  },
});

export const { setSelectedAnnotation } = projectAnnotationSlice.actions;
export default projectAnnotationSlice.reducer;