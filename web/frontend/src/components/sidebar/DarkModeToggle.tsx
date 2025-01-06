import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOpen: boolean;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  isDarkMode,
  toggleDarkMode,
  isOpen,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleDarkMode}
        className="text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition duration-300"
      >
        {isDarkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-400" />
        ) : (
          <MoonIcon className="w-5 h-5 text-white" />
        )}
      </button>
      {isOpen && (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </div>
  );
};

export default DarkModeToggle;
