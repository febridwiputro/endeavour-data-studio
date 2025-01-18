import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AnnotationsPage from "@/pages/annotations";

// Halaman kosong untuk "Image Color Picker"
const ImageColorPickerPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold">Image Color Picker</h1>
      <p className="text-gray-600">This feature is coming soon.</p>
    </div>
  );
};

const DashboardMenu: React.FC = () => {
  const { menu, loading, error } = useSelector((state: RootState) => state.menu);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  // Fungsi untuk menentukan apakah logo_url adalah SVG inline
  const isSvgCode = (logo: string | null) => {
    return logo?.trim().startsWith("<svg");
  };

  // Fungsi untuk mengganti warna SVG secara dinamis
  const modifySvgColor = (svgString: string) => {
    return svgString
      .replace(/stroke="currentColor"/g, 'stroke="#1a4e9d"')
      .replace(/fill="none"/g, 'fill="transparent"')
      .replace(/fill="currentColor"/g, 'fill="#1a4e9d"');
  };

  // Kembali ke Dashboard
  const handleBackToDashboard = () => {
    setSelectedMenu(null);
  };

  // Render halaman sesuai dengan menu yang dipilih
  if (selectedMenu === "Annotations") {
    return (
      <div>
        {/* <button
          onClick={handleBackToDashboard}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </button> */}
        <AnnotationsPage />
      </div>
    );
  }

  if (selectedMenu === "Image Color Picker") {
    return (
      <div>
        <button
          onClick={handleBackToDashboard}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </button>
        <ImageColorPickerPage />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-gray-900 mt-6 mb-10">
        MENU DASHBOARD
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white animate-pulse rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-36 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Grid Layout */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {menu.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg hover:scale-105 transition transform duration-300 cursor-pointer relative"
              onClick={() => setSelectedMenu(item.name)} // Set menu yang dipilih
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex items-center bg-[#1a4e9d] text-white text-xs rounded-md px-3 py-1 transition-opacity duration-200">
                {item.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a4e9d] rotate-45"></div>
              </div>

              {/* Image or SVG */}
              {isSvgCode(item.logo_url) ? (
                <div className="w-16 h-16 p-3 bg-[#e0ecff] rounded-lg flex items-center justify-center mb-4"
                  dangerouslySetInnerHTML={{ __html: modifySvgColor(item.logo_url!) }} />
              ) : (
                <img
                  src={item.logo_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 mb-4"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
              )}

              {/* Menu Name */}
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMenu;
