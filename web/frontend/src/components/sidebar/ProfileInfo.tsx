import React from "react";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

interface ProfileInfoProps {
  isProfileMenuOpen: boolean;
  toggleProfileMenu: () => void;
  isOpen: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  isProfileMenuOpen,
  toggleProfileMenu,
  isOpen,
}) => {
  return (
    <div className="relative flex items-center space-x-2">
      <button
        onClick={toggleProfileMenu}
        className="overflow-hidden rounded-full shadow-inner transition duration-300"
      >
        <img
          src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Profile"
          className="w-10 h-10 object-cover"
        />
      </button>
      {isOpen && (
        <div className="text-sm">
          <p className="text-xs text-gray-800 dark:text-gray-200">
            Febri Dwi Putro
          </p>
          <p className="text-xs text-gray-800 dark:text-gray-200">
            putrodwifebri@gmail.com
          </p>
        </div>
      )}
      {isProfileMenuOpen && (
        <div className="absolute bottom-full right-0 z-10 mb-2 w-48 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-2">
            <a
              href="#"
              className="flex items-center gap-2 block rounded-lg px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaUser className="w-4 h-4" />
              Profile
            </a>
            <a
              href="#"
              className="flex items-center gap-2 block rounded-lg px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaCog className="w-4 h-4" />
              Settings
            </a>
            <form method="POST" action="#">
              <button
                type="submit"
                className="flex items-center gap-2 w-full rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50 dark:hover:bg-red-700"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
