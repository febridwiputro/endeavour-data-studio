import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface SubFeature {
  name: string;
  description: string;
  points: string[];
}

interface MenuItem {
  name: string;
  description: string;
  sub_features: SubFeature[];
}

interface MenuState {
  menu: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menu: [],
  loading: false,
  error: null,
};

// Definisikan fetchMenu dengan createAsyncThunk
export const fetchMenu = createAsyncThunk('menu/fetchMenu', async () => {
    const response = await axios.get('http://localhost:8000/menu');
    return response.data.menu;
  });
  

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload;
      })
      .addCase(fetchMenu.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load menu';
      });
  },
});

export default menuSlice.reducer;
