import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "@/features/menu/menuSlice";
import videoReducer from "@/features/video/videoSlice";
import imagesReducer from "@/features/images/imageSlice";
import annotationsReducer from "@/features/annotations/project/projectAnnotationSlice";
import authReducer from "@/features/auth/authSlice";
import userReducer from "@/features/user/userSlice";
import projectAnnotationsReducer from "@/features/annotations/project/projectAnnotationSlice";
import annotationProjectUploadDataReducer from "@/features/annotations/project/annotationProjectUploadDataSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    video: videoReducer,
    images: imagesReducer,
    annotations: annotationsReducer,
    auth: authReducer,
    user: userReducer,
    projectAnnotations: projectAnnotationsReducer,
    projectUploads: annotationProjectUploadDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
