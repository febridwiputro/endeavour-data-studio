interface UserState {
    id: number | null;
    email: string | null;
    fullName: string | null;
    userPhoto: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  }