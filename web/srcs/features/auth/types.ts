// Define types for Auth State and API Responses
interface AuthState {
  accessToken: string | null;
  email: string | null;
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