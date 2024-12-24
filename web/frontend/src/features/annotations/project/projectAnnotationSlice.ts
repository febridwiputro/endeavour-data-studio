import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiConfig";

// Async thunk to fetch annotations by type
// export const fetchProjectAnnotationsByType = createAsyncThunk(
//     "projectAnnotations/fetchByType",
//     async (annotationType: string) => {
//         const response = await api.get(`/annotations/type/${annotationType}`);
//         return response.data;
//     }
// );
export const fetchProjectAnnotationsByType = createAsyncThunk(
    "projectAnnotations/fetchByType",
    async (codeName: string) => {
        const response = await api.get(`/annotations/type/${codeName}`);
        return response.data;
    }
);


// Async thunk to fetch all annotations
export const fetchAllAnnotations = createAsyncThunk(
    "projectAnnotations/fetchAll",
    async () => {
        const response = await api.get("/annotations/annotations");
        return response.data;
    }
);

// Async thunk to fetch annotation types
export const fetchAnnotationTypes = createAsyncThunk(
    "projectAnnotations/fetchTypes",
    async () => {
        const response = await api.get("/annotations/types");
        return response.data;
    }
);

const projectAnnotationSlice = createSlice({
    name: "projectAnnotations",
    initialState: {
        annotations: [] as Array<{ id: number; name: string; project_photo_url?: string }>,
        annotationTypes: [] as Array<{
            id: number;
            name: string;
            code_name: string;
            description?: string;
            logo_url?: string;
        }>,
        dataCount: 0,
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            .addCase(fetchAnnotationTypes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAnnotationTypes.fulfilled, (state, action) => {
                state.annotationTypes = action.payload.data;
                state.dataCount = action.payload.data_count;
                state.status = "succeeded";
            })
            .addCase(fetchAnnotationTypes.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export default projectAnnotationSlice.reducer;
