interface AuthState {
    access_token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: AuthState = {
    access_token: null,
    loading: false,
    error: null,
  };