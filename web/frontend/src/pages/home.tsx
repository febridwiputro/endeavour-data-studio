// src/pages/home.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchMenu } from "../features/menu/menuSlice";
import { RootState, AppDispatch } from "../store/store";
import Sidebar from "../components/sidebar/Sidebar";
import VideoToImage from "../components/video/VideoToImage";
import ConcatenateVideo from "../components/video/ConcatenateVideo";
import ImageGrid from "../components/ImageGrid";
import ProgressModal from "../components/video/ProgressModal";
import Modal from "../components/video/Modal";
import { resetProgress } from "../features/video/videoSlice";
import CompressImagesInFolder from "../components/images/CompressImagesInFolder";
import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
import AnnotationPage from "@/pages/AnnotationsPage";
import { useDarkMode } from "@/context/DarkModeContext";

const HomePage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { menu = [] } = useSelector((state: RootState) => state.menu);
  const { loading, progress, images = [], error } = useSelector(
    (state: RootState) => state.video
  );

  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const token = accessToken || localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(fetchMenu());
  }, [accessToken, dispatch, router]);

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
    setSelectedMenu(menuName);
  };

  return (
    <div
      className={`min-h-screen flex transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Sidebar
        onMenuClick={handleMenuClick}
        selectedMenu={selectedMenu}
        menuData={menu}
      />

      <div
        className={`flex-grow p-6 transition-colors ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-md rounded-md ml-4`}
      >
        {selectedMenu === "Annotations" && <AnnotationPage />}
        {selectedMenu === "Split by Number of Images" && (
          <>
            <VideoToImage />

            {showProgressModal && (
              <ProgressModal
                progress={progress}
                onClose={() => setShowProgressModal(false)}
              />
            )}
            {showSuccessModal && (
              <Modal
                show={true}
                title="Success"
                message="Video successfully processed!"
                onClose={() => setShowSuccessModal(false)}
              />
            )}
            {showErrorModal && (
              <Modal
                show={true}
                title="Error"
                message="Failed to process video."
                onClose={() => setShowErrorModal(false)}
              />
            )}

            <div className="mt-6">
              <ImageGrid images={images} />
            </div>
          </>
        )}
        {selectedMenu === "Concatenate by Composition" && (
          <>
            <ConcatenateVideo />
            {showProgressModal && (
              <ProgressModal
                progress={progress}
                onClose={() => setShowProgressModal(false)}
              />
            )}
          </>
        )}
        {selectedMenu === "Compress" && <CompressImagesInFolder />}
        {selectedMenu === "Image Size Adjustment" && <ImageSizeAdjustment />}
      </div>
    </div>
  );
};

export default HomePage;