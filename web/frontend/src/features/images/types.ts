interface ImagesState {
    loading: boolean;
    progress: number;
    adjustedImages: string[];
    compressedImages: string[];
    error: string | null;
  }