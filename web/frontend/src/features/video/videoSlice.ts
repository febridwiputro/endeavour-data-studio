import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

export const splitVideo = createAsyncThunk(
  'video/splitVideo',
  async (formData: FormData, { dispatch }) => {
    const response = await axios.post('http://localhost:8000/split-video', formData);
    const { video_id } = response.data;

    // Polling progress
    const checkProgress = () => {
      axios.get(`http://localhost:8000/progress/${video_id}`).then(res => {
        const { progress } = res.data;
        dispatch(setProgress(progress));

        if (progress < 100) {
          setTimeout(checkProgress, 1000);  // Poll every 1 second
        }
      });
    };
    checkProgress();

    return response.data;
  }
);

const videoSlice = createSlice({
  name: 'video',
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
    builder.addCase(splitVideo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(splitVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.images = action.payload.images;
    });
    builder.addCase(splitVideo.rejected, (state) => {
      state.loading = false;
      state.error = 'Failed to split video';
    });
  },
});

export const { setProgress, resetProgress } = videoSlice.actions;
export default videoSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface VideoState {
//   loading: boolean;
//   images: string[];
//   error: string | null;
// }

// const initialState: VideoState = {
//   loading: false,
//   images: [],
//   error: null,
// };

// export const splitVideo = createAsyncThunk(
//   'video/splitVideo',
//   async (formData: FormData) => {
//     const response = await axios.post('http://localhost:8000/split-video', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data.images;
//   }
// );

// const videoSlice = createSlice({
//   name: 'video',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(splitVideo.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(splitVideo.fulfilled, (state, action) => {
//       state.loading = false;
//       state.images = action.payload;
//     });
//     builder.addCase(splitVideo.rejected, (state) => {
//       state.loading = false;
//       state.error = 'Failed to split video';
//     });
//   },
// });

// export default videoSlice.reducer;
