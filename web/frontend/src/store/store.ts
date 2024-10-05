import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../features/menu/menuSlice';
import videoReducer from '../features/video/videoSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,   // Pastikan menu reducer sudah ada di sini
    video: videoReducer, // Tambahkan reducer lain jika ada
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
