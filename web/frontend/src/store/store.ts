import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../features/menu/menuSlice";
import videoReducer from "../features/video/videoSlice";
import imagesReducer from "@/features/images/imageSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    video: videoReducer,
    images: imagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
