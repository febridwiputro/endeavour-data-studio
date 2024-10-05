import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../features/menu/menuSlice';
import { RootState, AppDispatch } from '../store/store';
import Sidebar from '../components/Sidebar';
import VideoUploader from '../components/VideoUploader';
import ImageGrid from '../components/ImageGrid';
import ProgressModal from '../components/ProgressModal';
import Modal from '../components/Modal';
import { resetProgress } from '../features/video/videoSlice';
import Header from '../components/Header';  // Import Header component

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { menu = [] } = useSelector((state: RootState) => state.menu);
  const { loading, progress, images = [], error } = useSelector((state: RootState) => state.video);

  // Menu default adalah "Split Video"
  const [selectedMenu, setSelectedMenu] = useState('Split Video');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      setShowProgressModal(true);
    }

    if (!loading && progress === 100) {
      setShowProgressModal(false);

      if (images.length > 0) {
        setShowSuccessModal(true);
      } else if (error) {
        setShowErrorModal(true);
      }

      dispatch(resetProgress());
    }

    if (error && !loading) {
      setShowProgressModal(false);
      setShowErrorModal(true);
    }
  }, [loading, progress, images, error, dispatch]);

  const handleMenuClick = (menuName: string) => {
    // Jika submenu dari "Split Video" dipilih, tetap tampilkan "Split Video"
    const videoSubMenus = ['Split by Number of Images', 'Split by Duration', 'Split by Frame Rate'];
    
    if (videoSubMenus.includes(menuName)) {
      setSelectedMenu('Split Video');
    } else {
      setSelectedMenu(menuName);
    }
  };

  const selectedMenuItem = menu.find((item) =>
    item.sub_features?.some((subFeature) => subFeature.name === selectedMenu)
  );
  const description = selectedMenuItem
    ? selectedMenuItem.sub_features.find((subFeature) => subFeature.name === selectedMenu)?.description
    : '';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header /> {/* Add Header component at the top */}

      <div className="flex">
        {/* Sidebar */}
        <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

        {/* Main Content */}
        <div className="w-full p-6 bg-white shadow-md rounded-md ml-4">
          <h1 className="text-2xl font-bold mb-2 text-black">DE</h1>

          <p className="text-gray-600 mb-6">{description}</p>

          {selectedMenu === 'Split Video' && (
            <>
              <VideoUploader />

              {/* Modal Progress */}
              {showProgressModal && <ProgressModal progress={progress} onClose={() => setShowProgressModal(false)} />}

              {/* Modal Success */}
              {showSuccessModal && (
                <Modal
                  show={true}
                  title="Success"
                  message="Video successfully processed!"
                  onClose={() => setShowSuccessModal(false)}
                />
              )}

              {/* Modal Error */}
              {showErrorModal && (
                <Modal
                  show={true}
                  title="Error"
                  message="Failed to process video."
                  onClose={() => setShowErrorModal(false)}
                />
              )}

              {/* Image Grid */}
              <div className="mt-6">
                <ImageGrid images={images} />
              </div>
            </>
          )}

          {selectedMenu !== 'Split Video' && <p>Content for {selectedMenu} not available yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
