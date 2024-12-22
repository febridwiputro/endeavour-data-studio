import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiConfig";

// Utility function to get error messages
const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.detail) {
    if (Array.isArray(error.response.data.detail)) {
      return error.response.data.detail.join(", ");
    }
    return error.response.data.detail;
  }
  return "An unexpected error occurred.";
};

// Check if running in browser
const isBrowser = typeof window !== "undefined";

// Initial state
const initialState: AuthState = {
  accessToken: isBrowser ? localStorage.getItem("accessToken") : null,
  email: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { access_token } = response.data;
      return access_token;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    credentials: { email: string; password: string; confirm_password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", credentials);
      return response.data.data; // Return the email from the response
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", credentials);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (credentials: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-code", credentials);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const resendCode = createAsyncThunk(
  "auth/resendCode",
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/resend-code", credentials);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const passwordReset = createAsyncThunk(
  "auth/passwordReset",
  async (credentials: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/password-reset", credentials);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const passwordUpdate = createAsyncThunk(
  "auth/passwordUpdate",
  async (credentials: { email: string; new_password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/password-update", credentials);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.email = null;
      state.error = null;
      state.successMessage = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    },
    resetMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
        localStorage.setItem("accessToken", action.payload || "");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.successMessage = "Registration successful! Please verify your email.";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Code
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Resend Code
      .addCase(resendCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resendCode.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string;
      })
      .addCase(resendCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Password Reset
      .addCase(passwordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(passwordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string;
      })
      .addCase(passwordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Password Update
      .addCase(passwordUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(passwordUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string;
      })
      .addCase(passwordUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { logout, resetMessages } = authSlice.actions;
export default authSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/services/apiConfig";

// // Utility function to get error messages
// const extractErrorMessage = (error: any): string => {
//   if (error.response?.data?.detail) {
//     if (Array.isArray(error.response.data.detail)) {
//       return error.response.data.detail.join(", ");
//     }
//     return error.response.data.detail;
//   }
//   return "An unexpected error occurred.";
// };

// // Check if running in browser
// const isBrowser = typeof window !== "undefined";

// // Define types
// interface AuthState {
//   accessToken: string | null;
//   email: string | null;
//   loading: boolean;
//   error: string | null;
//   successMessage: string | null;
// }

// // Initial state
// const initialState: AuthState = {
//   accessToken: isBrowser ? localStorage.getItem("accessToken") : null,
//   email: null,
//   loading: false,
//   error: null,
//   successMessage: null,
// };

// // Async thunks
// export const login = createAsyncThunk(
//   "auth/login",
//   async (credentials: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/auth/login", credentials);
//       const { access_token } = response.data;
//       return access_token;
//     } catch (error: any) {
//       return rejectWithValue(extractErrorMessage(error));
//     }
//   }
// );

// export const register = createAsyncThunk(
//   "auth/register",
//   async (
//     credentials: { email: string; password: string; confirm_password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await api.post("/auth/register", credentials);
//       return response.data.data; // Return the email from the response
//     } catch (error: any) {
//       return rejectWithValue(extractErrorMessage(error));
//     }
//   }
// );

// export const forgotPassword = createAsyncThunk(
//   "auth/forgotPassword",
//   async (credentials: { email: string }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/auth/forgot-password", credentials);
//       return response.data.message;
//     } catch (error: any) {
//       return rejectWithValue(extractErrorMessage(error));
//     }
//   }
// );

// export const verifyCode = createAsyncThunk(
//   "auth/verifyCode",
//   async (credentials: { email: string; code: string }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/auth/verify-code", credentials);
//       return response.data.message;
//     } catch (error: any) {
//       return rejectWithValue(extractErrorMessage(error));
//     }
//   }
// );

// export const resendCode = createAsyncThunk(
//   "auth/resendCode",
//   async (credentials: { email: string }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/auth/resend-code", credentials);
//       return response.data.message;
//     } catch (error: any) {
//       return rejectWithValue(extractErrorMessage(error));
//     }
//   }
// );

// // Slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout(state) {
//       state.accessToken = null;
//       state.email = null;
//       state.error = null;
//       state.successMessage = null;
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("accessToken");
//       }
//     },
//     resetMessages(state) {
//       state.error = null;
//       state.successMessage = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload;
//         localStorage.setItem("accessToken", action.payload || "");
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Register
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = false;
//         state.email = action.payload.email;
//         state.successMessage = "Registration successful! Please verify your email.";
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Forgot Password
//       .addCase(forgotPassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(forgotPassword.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload as string;
//       })
//       .addCase(forgotPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Verify Code
//       .addCase(verifyCode.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(verifyCode.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload as string;
//       })
//       .addCase(verifyCode.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Resend Code
//       .addCase(resendCode.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(resendCode.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload as string;
//       })
//       .addCase(resendCode.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// // Export actions and reducer
// export const { logout, resetMessages } = authSlice.actions;
// export default authSlice.reducer;