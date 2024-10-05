import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { splitVideo } from '../features/video/videoSlice';
import { AppDispatch } from '../store/store';

const VideoUploader = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [numImages, setNumImages] = useState<number>(5);
  const dispatch = useDispatch<AppDispatch>();

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (videoFile) {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('num_images', numImages.toString());

      dispatch(splitVideo(formData));
    }
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-lg space-y-4" onSubmit={handleVideoUpload}>
      <div className="flex flex-col space-y-2">
        <label htmlFor="videoFile" className="font-semibold text-gray-800"> 
          Select Video File:
        </label>
        <input
          type="file"
          accept="video/mp4"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className="p-2 border rounded text-gray-700" 
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="numImages" className="font-semibold text-gray-800"> 
          Number of Images to Extract:
        </label>
        <input
          type="number"
          value={numImages}
          onChange={(e) => setNumImages(parseInt(e.target.value))}
          min={1}
          className="p-2 border rounded text-gray-700"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Upload and Split
      </button>
    </form>
  );
};


export default VideoUploader;
