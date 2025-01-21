import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchMenu } from "@/features/menu/menuSlice";
import { RootState, AppDispatch } from "@/store/store";
import Sidebar from "@/components/sidebar/Sidebar";
import VideoToImage from "@/components/video/VideoToImage";
import ConcatenateVideo from "@/components/video/ConcatenateVideo";
import CompressImagesInFolder from "@/components/images/CompressImagesInFolder";
import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
import { useDarkMode } from "@/context/DarkModeContext";
import Breadcrumb from "@/components/Breadcrumb";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import DashboardMenu from "@/components/dashboard/DashboardMenu";
import DashboardPage from "./dashboard";
// import AnnotationsPage from "@/pages/annotations";
import AnnotationsPage from "./annotations";

const HomePage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { menu } = useSelector((state: RootState) => state.menu);

  const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

  useEffect(() => {
    const token = accessToken || localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(fetchMenu());
  }, [accessToken, dispatch, router]);

  useEffect(() => {
    // **Pindahkan URL ke "/annotations" jika menu "Annotations" dipilih**
    if (selectedMenu === "Annotations" && router.pathname !== "/annotations") {
      router.push("/annotations");
    }
  }, [selectedMenu, router]);

  const handleMenuClick = (menuName: string) => {
    setSelectedMenu(menuName);
  };

  return (
    <div
      className={`min-h-screen flex transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      {/* Sidebar tetap ada */}
      <Sidebar
        onMenuClick={handleMenuClick}
        selectedMenu={selectedMenu}
        menuData={menu}
      />

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-grow">
        {/* Breadcrumb di luar Main Content */}
        <div className="bg-white dark:bg-gray-800 shadow-sm px-3">
          <Breadcrumb
            items={[
              {
                label: "Home",
                href: "/home",
                icon: <HomeIcon className="w-4 h-4" />,
              },
              ...(selectedMenu === "Annotations"
                ? [
                    {
                      label: "Annotations",
                      href: "/annotations",
                      icon: <FolderIcon className="w-4 h-4" />,
                      isActive: true,
                    },
                  ]
                : []),
            ]}
          />
        </div>

        {/* Main Content */}
        <div
          className={`flex-grow p-4 transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-md mx-2 mt-2`}
        >
          <div className="p-4">
            {selectedMenu === "Dashboard" && <DashboardPage />}
            {selectedMenu === "Annotations" && <AnnotationsPage />}
            {selectedMenu === "Split by Number of Images" && <VideoToImage />}
            {selectedMenu === "Concatenate by Composition" && (
              <ConcatenateVideo />
            )}
            {selectedMenu === "Compress" && <CompressImagesInFolder />}
            {selectedMenu === "Image Size Adjustment" && (
              <ImageSizeAdjustment />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// // src/pages/home.tsx

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import { RootState, AppDispatch } from "@/store/store";
// import Sidebar from "@/components/sidebar/Sidebar";
// import VideoToImage from "@/components/video/VideoToImage";
// import ConcatenateVideo from "@/components/video/ConcatenateVideo";
// import CompressImagesInFolder from "@/components/images/CompressImagesInFolder";
// import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
// import AnnotationsPage from "@/pages/annotations";
// import { useDarkMode } from "@/context/DarkModeContext";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon } from "@heroicons/react/24/outline";
// import DashboardMenu from "@/components/dashboard/DashboardMenu";

// const HomePage: React.FC = () => {
//   const { isDarkMode } = useDarkMode();
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { menu, loading, error } = useSelector((state: RootState) => state.menu);

//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

//   useEffect(() => {
//     const token = accessToken || localStorage.getItem("accessToken");

//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     dispatch(fetchMenu());
//   }, [accessToken, dispatch, router]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   return (
//     <div className={`min-h-screen flex transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       {/* Sidebar dengan lebar tetap */}
//       <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

//       {/* Main Content Wrapper */}
//       <div className="flex flex-col flex-grow">

//         {/* Breadcrumb di luar Main Content */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3">
//           <Breadcrumb items={[{ label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" />, isActive: true }]} />
//         </div>

//         {/* Main Content */}
//         <div className={`flex-grow p-6 transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-md mx-2 mt-2`}>
//           {/* Dynamic Content Based on Selected Menu */}
//           <div className="p-6">
//             {selectedMenu === "Dashboard" && <DashboardMenu />}
//             {selectedMenu === "Annotations" && <AnnotationsPage />}
//             {selectedMenu === "Split by Number of Images" && <VideoToImage />}
//             {selectedMenu === "Concatenate by Composition" && <ConcatenateVideo />}
//             {selectedMenu === "Compress" && <CompressImagesInFolder />}
//             {selectedMenu === "Image Size Adjustment" && <ImageSizeAdjustment />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
