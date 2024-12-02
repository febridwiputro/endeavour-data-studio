import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../features/menu/menuSlice";
import { RootState, AppDispatch } from "../store/store";
import Sidebar from "../components/Sidebar";
import VideoToImage from "../components/video/VideoToImage";
import ConcatenateVideo from "../components/video/ConcatenateVideo";
import ImageGrid from "../components/ImageGrid";
import ProgressModal from "../components/video/ProgressModal";
import Modal from "../components/video/Modal";
import { resetProgress } from "../features/video/videoSlice";
import Header from "../components/Header";
import CompressImagesInFolder from "../components/images/CompressImagesInFolder";
import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
import AnnotationPage from "@/pages/AnnotationsPage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage login state
  const [isSignUp, setIsSignUp] = useState(false); // Manage toggle between login and sign-up

  const { menu = [] } = useSelector((state: RootState) => state.menu);
  const { loading, progress, images = [], error } = useSelector(
    (state: RootState) => state.video
  );

  const [selectedMenu, setSelectedMenu] = useState(""); // Default state for no menu selected
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
    setSelectedMenu(menuName);
  };

  // Show login or sign-up page if not authenticated
  if (!isAuthenticated) {
    return isSignUp ? (
      <SignUpPage onBackToLogin={() => setIsSignUp(false)} />
    ) : (
      <LoginPage
        onLogin={() => setIsAuthenticated(true)}
        onSignUp={() => setIsSignUp(true)}
      />
    );
  }

  // Main content for authenticated users
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Header /> */}
      <div className="flex">
        <Sidebar
          onMenuClick={handleMenuClick}
          selectedMenu={selectedMenu}
          menuData={menu}
        />

        <div className="w-full p-6 bg-white shadow-md rounded-md ml-4">
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
    </div>
  );
};

export default Home;


// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMenu } from "../features/menu/menuSlice";
// import { RootState, AppDispatch } from "../store/store";
// import Sidebar from "../components/Sidebar";
// import VideoToImage from "../components/video/VideoToImage";
// import ConcatenateVideo from "../components/video/ConcatenateVideo";
// import ImageGrid from "../components/ImageGrid";
// import ProgressModal from "../components/video/ProgressModal";
// import Modal from "../components/video/Modal";
// import { resetProgress } from "../features/video/videoSlice";
// import Header from "../components/Header";
// import CompressImagesInFolder from "../components/images/CompressImagesInFolder";
// import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
// import AnnotationPage from "@/pages/AnnotationsPage";

// const Home = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { menu = [] } = useSelector((state: RootState) => state.menu);
//   const {
//     loading,
//     progress,
//     images = [],
//     error,
//   } = useSelector((state: RootState) => state.video);

//   const [selectedMenu, setSelectedMenu] = useState(""); // Default state for no menu selected
//   const [showProgressModal, setShowProgressModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   useEffect(() => {
//     if (loading) {
//       setShowProgressModal(true);
//     }

//     if (!loading && progress === 100) {
//       setShowProgressModal(false);

//       if (images.length > 0) {
//         setShowSuccessModal(true);
//       } else if (error) {
//         setShowErrorModal(true);
//       }

//       dispatch(resetProgress());
//     }

//     if (error && !loading) {
//       setShowProgressModal(false);
//       setShowErrorModal(true);
//     }
//   }, [loading, progress, images, error, dispatch]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <div className="flex">
//         <Sidebar
//           onMenuClick={handleMenuClick}
//           selectedMenu={selectedMenu}
//           menuData={menu}
//         />

//         <div className="w-full p-6 bg-white shadow-md rounded-md ml-4">
//           {selectedMenu === "Annotations" && <AnnotationPage />}
//           {selectedMenu === "Split by Number of Images" && (
//             <>
//               <VideoToImage />

//               {showProgressModal && (
//                 <ProgressModal
//                   progress={progress}
//                   onClose={() => setShowProgressModal(false)}
//                 />
//               )}
//               {showSuccessModal && (
//                 <Modal
//                   show={true}
//                   title="Success"
//                   message="Video successfully processed!"
//                   onClose={() => setShowSuccessModal(false)}
//                 />
//               )}
//               {showErrorModal && (
//                 <Modal
//                   show={true}
//                   title="Error"
//                   message="Failed to process video."
//                   onClose={() => setShowErrorModal(false)}
//                 />
//               )}

//               <div className="mt-6">
//                 <ImageGrid images={images} />
//               </div>
//             </>
//           )}
//           {selectedMenu === "Concatenate by Composition" && (
//             <>
//               <ConcatenateVideo />
//               {showProgressModal && (
//                 <ProgressModal
//                   progress={progress}
//                   onClose={() => setShowProgressModal(false)}
//                 />
//               )}
//             </>
//           )}
//           {/* Fallback content for unknown selected menu */}
//           {selectedMenu &&
//             selectedMenu !== "Split by Number of Images" &&
//             selectedMenu !== "Concatenate by Composition"}
//           {/* Conditional Rendering for Different Menus */}
//           {selectedMenu === "Compress" && <CompressImagesInFolder />}{" "}
//           {/* Render CompressImagesInFolder when 'Compress' is selected */}
//           {selectedMenu === "Image Size Adjustment" && (
//             <ImageSizeAdjustment />
//           )}{" "}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;