import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  selectedProjectId: number | null;
}

const initialState: ProjectState = {
  selectedProjectId: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProjectId: (state, action: PayloadAction<number | null>) => {
      state.selectedProjectId = action.payload;
    },
  },
});

export const { setSelectedProjectId } = projectSlice.actions;
export default projectSlice.reducer;
