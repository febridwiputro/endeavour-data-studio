import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface VideoState {
  loading: boolean;
  progress: number;
  images: string[];
  error: string | null;
}

const initialState: VideoState = {
  loading: false,
  progress: 0,
  images: [],
  error: null,
};

// Thunk for splitting video
export const splitVideo = createAsyncThunk(
  "video/splitVideo",
  async (formData: FormData, { dispatch }) => {
    const response = await axios.post(
      `http://localhost:8000/videos/split-video-to-img`,
      formData
    );
    const { video_id } = response.data;

    // Polling progress
    const checkProgress = () => {
      axios
        .get(
          `http://localhost:8000/videos/progress-split-video-to-img/${video_id}`
        )
        .then((res) => {
          const { progress } = res.data;
          dispatch(setProgress(progress));

          if (progress < 100) {
            setTimeout(checkProgress, 1000); // Poll every 1 second
          }
        });
    };
    checkProgress();

    return response.data;
  }
);

// Thunk for concatenating videos
export const concatenateVideos = createAsyncThunk(
  "video/concatenateVideos",
  async (formData: FormData, { dispatch }) => {
    const response = await axios.post(
      "http://localhost:8000/videos/concatenate-videos",
      formData
    );
    const { video_id } = response.data;

    // Polling progress for concatenation
    const checkProgress = () => {
      axios
        .get(`http://localhost:8000/videos/concatenation-progress/${video_id}`)
        .then((res) => {
          const { progress } = res.data;
          dispatch(setProgress(progress));

          if (progress < 100) {
            setTimeout(checkProgress, 1000); // Poll every 1 second
          }
        });
    };
    checkProgress();

    return response.data;
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetProgress: (state) => {
      state.progress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Split Video
      .addCase(splitVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(splitVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload.images;
      })
      .addCase(splitVideo.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to split video";
      })
      // Concatenate Videos
      .addCase(concatenateVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(concatenateVideos.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(concatenateVideos.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to concatenate videos";
      });
  },
});

export const { setProgress, resetProgress } = videoSlice.actions;
export default videoSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface VideoState {
//   loading: boolean;
//   progress: number;
//   images: string[];
//   error: string | null;
// }

// const initialState: VideoState = {
//   loading: false,
//   progress: 0,
//   images: [],
//   error: null,
// };

// export const splitVideo = createAsyncThunk(
//   'video/splitVideo',
//   async (formData: FormData, { dispatch }) => {
//     const response = await axios.post('http://localhost:8000/split-video', formData);
//     const { video_id } = response.data;

//     // Polling progress
//     const checkProgress = () => {
//       axios.get(`http://localhost:8000/progress/${video_id}`).then(res => {
//         const { progress } = res.data;
//         dispatch(setProgress(progress));

//         if (progress < 100) {
//           setTimeout(checkProgress, 1000);  // Poll every 1 second
//         }
//       });
//     };
//     checkProgress();

//     return response.data;
//   }
// );

// const videoSlice = createSlice({
//   name: 'video',
//   initialState,
//   reducers: {
//     setProgress: (state, action) => {
//       state.progress = action.payload;
//     },
//     resetProgress: (state) => {
//       state.progress = 0;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(splitVideo.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(splitVideo.fulfilled, (state, action) => {
//       state.loading = false;
//       state.images = action.payload.images;
//     });
//     builder.addCase(splitVideo.rejected, (state) => {
//       state.loading = false;
//       state.error = 'Failed to split video';
//     });
//   },
// });

// export const { setProgress, resetProgress } = videoSlice.actions;
// export default videoSlice.reducer;
