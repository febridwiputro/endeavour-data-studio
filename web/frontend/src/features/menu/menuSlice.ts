import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/apiConfig";

// Definisi struktur state
interface MenuState {
  menu: Array<{
    id: number;
    name: string;
    description: string;
    logo_url: string | null;
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menu: [],
  loading: false,
  error: null,
};

// Fetch menus menggunakan async thunk
export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const response = await api.get("/menu/menus");
  return response.data.data.map((menu: any) => ({
    id: menu.id,
    name: menu.name,
    description: menu.description,
    logo_url: menu.logo_url,
  }));
});

// Membuat Redux slice untuk menu
const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load menu";
      });
  },
});

export default menuSlice.reducer;



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState: MenuState = {
//   menu: [],
//   loading: false,
//   error: null,
// };

// // Definisikan fetchMenu dengan createAsyncThunk
// export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
//   const response = await axios.get("http://localhost:8000/menu");
//   return response.data.menu;
// });

// const menuSlice = createSlice({
//   name: "menu",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMenu.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchMenu.fulfilled, (state, action) => {
//         state.loading = false;
//         state.menu = action.payload;
//       })
//       .addCase(fetchMenu.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to load menu";
//       });
//   },
// });

// export default menuSlice.reducer;
