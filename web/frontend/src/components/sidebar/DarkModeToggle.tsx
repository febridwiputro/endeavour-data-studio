import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

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
          <FaSun className="w-5 h-5 text-yellow-400" />
        ) : (
          <FaMoon className="w-5 h-5" />
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
