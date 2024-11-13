import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ImagesState {
  loading: boolean;
  progress: number;
  adjustedImages: string[];
  compressedImages: string[];
  error: string | null;
}

const initialState: ImagesState = {
  loading: false,
  progress: 0,
  adjustedImages: [],
  compressedImages: [],
  error: null,
};

// Thunk untuk penyesuaian ukuran gambar
export const adjustImageSize = createAsyncThunk(
  "images/adjustImageSize",
  async (formData: FormData, { dispatch }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/images/adjust-images-in-folder",
        formData
      );
      const { adjustment_id } = response.data;

      if (!adjustment_id) throw new Error("Adjust ID is undefined");

      const checkProgress = () => {
        axios
          .get(
            `http://localhost:8000/images/progress-adjust-images-in-folder/${adjustment_id}`
          )
          .then((res) => {
            const { progress } = res.data;
            dispatch(setProgress(progress));
            if (progress < 100) setTimeout(checkProgress, 1000);
            else dispatch(setProgress(100));
          })
          .catch((err) => console.error("Error checking progress:", err));
      };

      checkProgress();

      return response.data;
    } catch (error) {
      console.error("Error during image size adjustment:", error);
      throw error;
    }
  }
);

// Thunk untuk mengompresi gambar yang diunggah
export const compressUploadedImages = createAsyncThunk(
  "images/compressUploadedImages",
  async (formData: FormData, { dispatch }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/images/compress-uploaded-images",
        formData
      );
      const { compress_id } = response.data;

      if (!compress_id) throw new Error("Compress ID is undefined");

      const checkProgress = () => {
        axios
          .get(
            `http://localhost:8000/images/progress-compress-uploaded-images/${compress_id}`
          )
          .then((res) => {
            const { progress } = res.data;
            dispatch(setProgress(progress));
            if (progress < 100) setTimeout(checkProgress, 1000);
          })
          .catch((err) => console.error("Error checking progress:", err));
      };

      checkProgress();

      return response.data;
    } catch (error) {
      console.error("Error during compression:", error);
      throw error;
    }
  }
);

// Thunk untuk mengompresi gambar dalam folder
export const compressImagesInFolder = createAsyncThunk(
  "images/compressImagesInFolder",
  async (formData: FormData, { dispatch }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/images/compress-images-in-folder",
        formData
      );
      const { compress_id } = response.data;

      if (!compress_id) throw new Error("Compress ID is undefined");

      const checkProgress = () => {
        axios
          .get(
            `http://localhost:8000/images/progress-compress-images-in-folder/${compress_id}`
          )
          .then((res) => {
            const { progress } = res.data;
            dispatch(setProgress(progress));
            if (progress < 100) setTimeout(checkProgress, 1000);
          })
          .catch((err) => console.error("Error checking progress:", err));
      };

      checkProgress();

      return response.data;
    } catch (error) {
      console.error("Error during compression:", error);
      throw error;
    }
  }
);

// Thunk untuk mengompresi gambar yang dipilih
export const compressSelectedImages = createAsyncThunk(
  "images/compressSelectedImages",
  async (formData: FormData, { dispatch }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/compress-selected-images",
        formData
      );
      const { image_id } = response.data;

      const checkProgress = () => {
        axios
          .get(
            `http://localhost:8000/progress-compress-single-image/${image_id}`
          )
          .then((res) => {
            const { progress } = res.data;
            dispatch(setProgress(progress));
            if (progress < 100) setTimeout(checkProgress, 1000);
          })
          .catch((err) => console.error("Error checking progress:", err));
      };

      checkProgress();

      return response.data;
    } catch (error) {
      console.error("Error during compression:", error);
      throw error;
    }
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetProgress: (state) => {
      state.progress = 0;
      state.adjustedImages = [];
      state.compressedImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Adjust Image Size
      .addCase(adjustImageSize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adjustImageSize.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to adjust image size";
      })
      // Compress Selected Images
      .addCase(compressSelectedImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(compressSelectedImages.fulfilled, (state, action) => {
        state.loading = false;
        state.compressedImages.push(...action.payload.image_paths);
      })
      .addCase(compressSelectedImages.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to compress selected images";
      })
      // Compress Images in Folder
      .addCase(compressImagesInFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(compressImagesInFolder.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.compressedImages.push(...action.payload.image_paths);
      // })
      .addCase(compressImagesInFolder.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to compress images in folder";
      })
      // Compress Uploaded Images
      .addCase(compressUploadedImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(compressUploadedImages.fulfilled, (state, action) => {
        state.loading = false;
        state.compressedImages.push(...action.payload.image_paths);
      })
      .addCase(compressUploadedImages.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to compress uploaded images";
      });
  },
});

export const { setProgress, resetProgress } = imagesSlice.actions;
export default imagesSlice.reducer;

//  ###############################

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// interface ImagesState {
//   loading: boolean;
//   progress: number;
//   adjustedImages: string[];
//   compressedImages: string[];
//   error: string | null;
// }

// const initialState: ImagesState = {
//   loading: false,
//   progress: 0,
//   adjustedImages: [],
//   compressedImages: [],
//   error: null,
// };

// export const adjustImageSize = createAsyncThunk(
//   "images/adjustImageSize",
//   async (formData: FormData, { dispatch }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/images/adjust-images-in-folder",
//         formData
//       );
//       const { adjustment_id } = response.data;

//       console.log(response.data);

//       console.log("adjustment_id: ", adjustment_id);

//       if (!adjustment_id) {
//         throw new Error("Adjust ID is undefined");
//       }

//       const checkProgress = () => {
//         axios
//           .get(
//             `http://localhost:8000/images/progress-adjust-images-in-folder/${adjustment_id}`
//           )
//           .then((res) => {
//             const { progress } = res.data;
//             dispatch(setProgress(progress));

//             if (progress < 100) {
//               setTimeout(checkProgress, 1000);
//             } else {
//               dispatch(setProgress(100));
//             }
//           })
//           .catch((err) => {
//             console.error("Error checking progress:", err);
//           });
//       };

//       checkProgress();

//       return response.data;
//     } catch (error) {
//       console.error("Error during image size adjustment:", error);
//       throw error;
//     }
//   }
// );

// // Async thunk for compressing uploaded images
// export const compressUploadedImages = createAsyncThunk(
//   "images/compressUploadedImages",
//   async (formData: FormData, { dispatch }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/images/compress-uploaded-images",
//         formData
//       );
//       const { compress_id } = response.data;

//       if (!compress_id) {
//         throw new Error("Compress ID is undefined");
//       }

//       const checkProgress = () => {
//         axios
//           .get(
//             `http://localhost:8000/images/progress-compress-uploaded-images/${compress_id}`
//           )
//           .then((res) => {
//             const { progress } = res.data;
//             dispatch(setProgress(progress));

//             if (progress < 100) {
//               setTimeout(checkProgress, 1000);
//             }
//           })
//           .catch((err) => {
//             console.error("Error checking progress:", err);
//           });
//       };

//       checkProgress();

//       return response.data;
//     } catch (error) {
//       console.error("Error during compression:", error);
//       throw error;
//     }
//   }
// );

// // Async thunk for compressing images in a folder
// export const compressImagesInFolder = createAsyncThunk(
//   "images/compressImagesInFolder",
//   async (formData: FormData, { dispatch }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/images/compress-images-in-folder",
//         formData
//       );
//       const { compress_id } = response.data;

//       console.log("compress_id: ", compress_id);

//       if (!compress_id) {
//         throw new Error("Compress ID is undefined");
//       }

//       const checkProgress = () => {
//         axios
//           .get(
//             `http://localhost:8000/images/progress-compress-images-in-folder/${compress_id}`
//           )
//           .then((res) => {
//             const { progress } = res.data;
//             dispatch(setProgress(progress));

//             if (progress < 100) {
//               setTimeout(checkProgress, 1000);
//             }
//           })
//           .catch((err) => {
//             console.error("Error checking progress:", err);
//           });
//       };

//       checkProgress();

//       return response.data;
//     } catch (error) {
//       console.error("Error during compression:", error);
//       throw error;
//     }
//   }
// );

// // Async thunk for compressing selected images
// export const compressSelectedImages = createAsyncThunk(
//   "images/compressSelectedImages",
//   async (formData: FormData, { dispatch }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/compress-selected-images",
//         formData
//       );
//       const { image_id } = response.data;

//       const checkProgress = () => {
//         axios
//           .get(
//             `http://localhost:8000/progress-compress-single-image/${image_id}`
//           )
//           .then((res) => {
//             const { progress } = res.data;
//             dispatch(setProgress(progress));

//             if (progress < 100) {
//               setTimeout(checkProgress, 1000);
//             }
//           })
//           .catch((err) => {
//             console.error("Error checking progress:", err);
//           });
//       };

//       checkProgress();

//       return response.data;
//     } catch (error) {
//       console.error("Error during compression:", error);
//       throw error;
//     }
//   }
// );

// const imagesSlice = createSlice({
//   name: "images",
//   initialState,
//   reducers: {
//     setProgress: (state, action) => {
//       state.progress = action.payload;
//     },
//     resetProgress: (state) => {
//       state.progress = 0;
//       state.adjustedImages = [];
//       state.compressedImages = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Adjust Image Size
//       .addCase(adjustImageSize.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       // .addCase(adjustImageSize.fulfilled, (state, action) => {
//       //   state.loading = false;
//       //   if (action.payload?.image_paths) {
//       //     state.adjustedImages.push(...action.payload.image_paths);
//       //   } else {
//       //     state.error = "Image paths not found in the response.";
//       //   }
//       // })
//       .addCase(adjustImageSize.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to adjust image size";
//       })
//       // Compress Selected Images
//       .addCase(compressSelectedImages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(compressSelectedImages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.compressedImages.push(...action.payload.image_paths);
//       })
//       .addCase(compressSelectedImages.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to compress selected images";
//       })
//       // Compress Images in Folder
//       .addCase(compressImagesInFolder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(compressImagesInFolder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.compressedImages.push(...action.payload.image_paths);
//       })
//       .addCase(compressImagesInFolder.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to compress images in folder";
//       })
//       // Compress Uploaded Images
//       .addCase(compressUploadedImages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(compressUploadedImages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.compressedImages.push(...action.payload.image_paths);
//       })
//       .addCase(compressUploadedImages.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to compress uploaded images";
//       });
//   },
// });

// export const { setProgress, resetProgress } = imagesSlice.actions;
// export default imagesSlice.reducer;

//  ####################

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// interface ImagesState {
//   loading: boolean;
//   progress: number;
//   compressedImages: string[];
//   error: string | null;
// }

// const initialState: ImagesState = {
//   loading: false,
//   progress: 0,
//   compressedImages: [],
//   error: null,
// };

// export const compressUploadedImages = createAsyncThunk(
//   "images/compressUploadedImages",
//   async (formData: FormData, { dispatch }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/compress-uploaded-images",
//         formData
//       );
//       const { compress_id } = response.data;

//       if (!compress_id) {
//         throw new Error("Compress ID is undefined");
//       }

//       const checkProgress = () => {
//         axios
//           .get(
//             `http://localhost:8000/progress-compress-uploaded-images/${compress_id}`
//           )
//           .then((res) => {
//             const { progress } = res.data;
//             dispatch(setProgress(progress));

//             if (progress < 100) {
//               setTimeout(checkProgress, 1000);
//             }
//           })
//           .catch((err) => {
//             console.error("Error checking progress:", err);
//           });
//       };

//       checkProgress();

//       return response.data;
//     } catch (error) {
//       console.error("Error during compression:", error);

//       // Enhanced error logging
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error data:", error.response?.data);
//         console.error("Axios error status:", error.response?.status);
//         console.error("Axios error headers:", error.response?.headers);

//         if (error.response?.data?.detail) {
//           console.error("Error detail:", error.response.data.detail);
//         }
//       } else {
//         console.error("General error:", error);
//       }

//       throw error; // Re-throw the error for further handling if needed
//     }
//   }
// );

// export const compressImagesInFolder = createAsyncThunk(
//   "images/compressImagesInFolder",
//   async (formData: FormData, { dispatch }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/compress-images-in-folder",
//         formData
//       );
//       // console.log("Full response:", response.data);

//       const { compress_id } = response.data;

//       if (!compress_id) {
//         throw new Error("Compress ID is undefined");
//       }

//       const checkProgress = () => {
//         axios
//           .get(
//             `http://localhost:8000/progress-compress-images-in-folder/${compress_id}`
//           )
//           .then((res) => {
//             const { progress } = res.data;
//             dispatch(setProgress(progress));

//             if (progress < 100) {
//               setTimeout(checkProgress, 1000);
//             }
//           })
//           .catch((err) => {
//             console.error("Error checking progress:", err);
//           });
//       };

//       checkProgress();

//       return response.data;
//     } catch (error) {
//       console.error("Error during compression:", error);
//       throw error;
//     }
//   }
// );

// export const compressSelectedImages = createAsyncThunk(
//   "images/compressSelectedImages",
//   async (formData: FormData, { dispatch }) => {
//     const response = await axios.post(
//       "http://localhost:8000/compress-selected-images",
//       formData
//     );
//     const { image_id } = response.data;

//     const checkProgress = () => {
//       axios
//         .get(`http://localhost:8000/progress-compress-single-image/${image_id}`)
//         .then((res) => {
//           const { progress } = res.data;
//           dispatch(setProgress(progress));

//           if (progress < 100) {
//             setTimeout(checkProgress, 1000);
//           }
//         });
//     };
//     checkProgress();

//     return response.data;
//   }
// );

// const imagesSlice = createSlice({
//   name: "images",
//   initialState,
//   reducers: {
//     setProgress: (state, action) => {
//       state.progress = action.payload;
//     },
//     resetProgress: (state) => {
//       state.progress = 0;
//       state.compressedImages = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Compress Selected Images
//       .addCase(compressSelectedImages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(compressSelectedImages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.compressedImages.push(...action.payload.image_paths);
//       })
//       .addCase(compressSelectedImages.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to compress selected images";
//       })
//       // Compress Images in Folder
//       .addCase(compressImagesInFolder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       // .addCase(compressImagesInFolder.fulfilled, (state, action) => {
//       //   state.loading = false;
//       //   state.compressedImages.push(...action.payload.image_paths);
//       // })
//       .addCase(compressImagesInFolder.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to compress images in folder";
//       })
//       // Compress Uploaded Images
//       .addCase(compressUploadedImages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(compressUploadedImages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.compressedImages.push(...action.payload.image_paths);
//       })
//       .addCase(compressUploadedImages.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to compress uploaded images";
//       });
//   },
// });

// export const { setProgress, resetProgress } = imagesSlice.actions;
// export default imagesSlice.reducer;

//  ###################

// export const compressUploadedImages = createAsyncThunk(
//   'images/compressUploadedImages',
//   async (formData: FormData, { dispatch }) => {
//     try {
//       const response = await axios.post('http://localhost:8000/compress-uploaded-images', formData);
//        console.log("Full response:", response.data);
//       const { compress_id } = response.data;

//       if (!compress_id) {
//         throw new Error("Compress ID is undefined");
//       }

//       const checkProgress = () => {
//         axios.get(`http://localhost:8000/progress-compress-uploaded-images/${compress_id}`)
//           .then(res => {
//             const { progress } = res.data;
//             dispatch(setProgress(progress));

//             if (progress < 100) {
//               setTimeout(checkProgress, 1000);
//             }
//           })
//           .catch(err => {
//             console.error("Error checking progress:", err);
//           });
//       };

//       checkProgress();

//       return response.data;
//     } catch (error) {
//       console.error("Error during compression:", error);
//       throw error;
//     }
//   }
// );

// extraReducers: (builder) => {
//   builder
//     // Compress Selected Images
//     .addCase(compressSelectedImages.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     })
//     .addCase(compressSelectedImages.fulfilled, (state, action) => {
//       state.loading = false;
//       state.compressedImages.push(...action.payload.image_paths);
//     })
//     .addCase(compressSelectedImages.rejected, (state) => {
//       state.loading = false;
//       state.error = 'Failed to compress selected images';
//     })
//     // Compress Images in Folder
//     .addCase(compressImagesInFolder.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     })
//     .addCase(compressImagesInFolder.fulfilled, (state, action) => {
//       state.loading = false;
//       state.compressedImages.push(...action.payload.image_paths);
//     })
//     .addCase(compressImagesInFolder.rejected, (state) => {
//       state.loading = false;
//       state.error = 'Failed to compress images in folder';
//     });
// },
