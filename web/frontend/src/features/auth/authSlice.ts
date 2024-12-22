// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for Auth State and API Responses
interface AuthState {
  accessToken: string | null;
  email: string | null; // Store the registered email
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

interface ApiResponse<T = any> {
  data: T;
  message: string;
}

interface ApiError {
  detail: string | string[];
}

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
  email: null, // Initialize email as null
  loading: false,
  error: null,
  successMessage: null,
};

// Async thunks
// Login
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<ApiResponse<string>>(
        "http://localhost:8000/auth/login",
        credentials
      );
      const token = response.data.data;

      // Store the token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }

      return token;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
// export const login = createAsyncThunk(
//   "auth/login",
//   async (
//     credentials: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post<ApiResponse<string>>(
//         "http://localhost:8000/auth/login",
//         credentials
//       );
//       if (isBrowser) {
//         localStorage.setItem("accessToken", response.data.data);
//       }
//       return response.data.data; // Access token
//     } catch (error: any) {
//       return rejectWithValue(extractErrorMessage(error));
//     }
//   }
// );

// Async thunks
// Register
export const register = createAsyncThunk(
  "auth/register",
  async (
    credentials: { email: string; password: string; confirm_password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<ApiResponse<{ email: string }>>(
        "http://localhost:8000/auth/register",
        credentials
      );
      return response.data.data; // Return the email from the response
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:8000/auth/forgot-password",
        credentials
      );
      return response.data.message; // Success message
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Verify Code
export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (credentials: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:8000/auth/verify-code",
        credentials
      );
      return response.data.message; // Success message
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Resend Code
export const resendCode = createAsyncThunk(
  "auth/resendCode",
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:8000/auth/resend-code",
        credentials
      );
      return response.data.message; // Success message
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
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout(state) {
//       state.accessToken = null;
//       state.email = null;
//       state.error = null;
//       state.successMessage = null;
//       if (isBrowser) {
//         localStorage.removeItem("accessToken");
//       }
//     },
//     resetMessages(state) {
//       state.error = null;
//       state.successMessage = null;
//     },
//   },
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
        state.email = action.payload.email; // Save the email from the response
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
      });
  },
});

// Export actions and reducer
export const { logout, resetMessages } = authSlice.actions;
export default authSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// interface AuthState {
//   accessToken: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const isBrowser = typeof window !== "undefined";

// const initialState: AuthState = {
//   accessToken: isBrowser ? localStorage.getItem("accessToken") : null,
//   loading: false,
//   error: null,
// };

// // Define login async thunk
// export const login = createAsyncThunk(
//   "auth/login",
//   async (
//     credentials: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/auth/login",
//         credentials
//       );
//       if (isBrowser) {
//         localStorage.setItem("accessToken", response.data.access_token);
//       }
//       return response.data.access_token;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.detail || "Failed to login");
//     }
//   }
// );

// // Define register async thunk
// export const register = createAsyncThunk(
//   "auth/register",
//   async (
//     credentials: { email: string; password: string; confirm_password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post("http://localhost:8000/auth/register", credentials);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.detail || "Registration failed");
//     }
//   }
// );

// // Forgot Password async thunk
// export const forgotPassword = createAsyncThunk(
//   "auth/forgotPassword",
//   async (credentials: { email: string }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/auth/forgot-password",
//         credentials
//       );
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.detail || "Failed to send reset code"
//       );
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout(state) {
//       state.accessToken = null;
//       state.error = null;
//       if (isBrowser) {
//         localStorage.removeItem("accessToken");
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login handlers
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Register handlers
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Forgot Password handlers
//       .addCase(forgotPassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(forgotPassword.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(forgotPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// // Export actions and reducer
// export const { logout } = authSlice.actions;
// export default authSlice.reducer;