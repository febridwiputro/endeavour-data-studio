import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


const DashboardMenu: React.FC = () => {
  const { menu, loading, error } = useSelector((state: RootState) => state.menu);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  // Fungsi untuk menentukan apakah logo_url adalah SVG inline
  const isSvgCode = (logo: string | null) => logo?.trim().startsWith("<svg");

  // Fungsi untuk mengganti warna SVG secara dinamis
  const modifySvgColor = (svgString: string) => {
    return svgString
      .replace(/stroke="currentColor"/g, 'stroke="#1a4e9d"')
      .replace(/fill="none"/g, 'fill="transparent"')
      .replace(/fill="currentColor"/g, 'fill="#1a4e9d"');
  };


  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mt-4 mb-8">
        MENU DASHBOARD
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white animate-pulse rounded-lg shadow-sm p-4 flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mb-3"></div>
              <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
              <div className="h-2 w-28 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Grid Layout */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-lg shadow-sm p-3 flex flex-col items-center hover:shadow-md hover:scale-105 transition transform duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
              onClick={() => setSelectedMenu(item.name)}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex items-center bg-[#1a4e9d] text-white text-xs rounded-md px-3 py-1 transition-opacity duration-200">
                {item.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a4e9d] rotate-45"></div>
              </div>

              {/* Image or SVG */}
              {isSvgCode(item.logo_url) ? (
                <div className="w-12 h-12 p-2 bg-[#e0ecff] rounded-md flex items-center justify-center mb-3"
                  dangerouslySetInnerHTML={{ __html: modifySvgColor(item.logo_url!) }} />
              ) : (
                <img
                  src={item.logo_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-12 h-12 mb-3 rounded-md"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
              )}

              {/* Menu Name */}
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{item.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMenu;