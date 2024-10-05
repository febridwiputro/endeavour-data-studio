import { useSelector } from 'react-redux';
import { RootState } from '../../../web/frontend/src/store/store';
import VideoUploader from '../../../web/frontend/src/components/VideoUploader';
import ImageGrid from '../../../web/frontend/src/components/ImageGrid';
import Loader from '../../../web/frontend/src/components/Loader';

export default function Home() {
  const { loading, images } = useSelector((state: RootState) => state.video);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Dataset Editor</h1>

      <VideoUploader />

      {loading ? (
        <Loader />
      ) : (
        <div className="mt-6">
          <ImageGrid images={images} />
        </div>
      )}
    </div>
  );
}
