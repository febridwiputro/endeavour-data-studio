import { useState } from "react";
import { FaMoon, FaSun, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode toggle
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State for profile dropdown

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode); // Toggle dark mode in the root HTML element
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-[#1a4f9d] shadow-sm">
      <div className="w-full py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 2048 2048"
            fill="#699bf7"
          >
            <rect width="2048" height="2048" fill="none" />
            <path
              fill="white"
              d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
            />
          </svg>
          <span className="text-2xl font-bold text-white">Data Studio</span>
        </div>

        {/* Right Side: Profile Menu and Dark Mode Toggle */}
        <div className="flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-white hover:bg-blue-600 rounded-full p-2 transition duration-300"
          >
            {isDarkMode ? (
              <FaSun className="w-5 h-5 text-yellow-400" />
            ) : (
              <FaMoon className="w-5 h-5" />
            )}
          </button>

          {/* User Info */}
          <div className="flex items-center text-white space-x-4">
            <div className="text-right">
              <p className="text-xs">Febri Dwi Putro</p>
              <p className="text-xs">putrodwifebri@gmail.com</p>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="overflow-hidden rounded-full shadow-inner transition duration-300"
                style={{
                  backgroundColor: "var(--default-blue)",
                  border: "2px solid var(--default-blue)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--hover-blue)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--default-blue)")
                }
              >
                <img
                  src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt="Profile"
                  className="w-10 h-10 object-cover"
                />
              </button>

              {/* Profile Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-100 bg-white shadow-lg dark:bg-gray-900 dark:border-gray-800">
                  <div className="p-2">
                    <a
                      href="#"
                      className="flex items-center gap-2 block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <FaUser className="w-4 h-4" /> {/* Profile Icon */}
                      Profile
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <FaCog className="w-4 h-4" /> {/* Settings Icon */}
                      Settings
                    </a>
                    <form method="POST" action="#">
                      <button
                        type="submit"
                        className="flex items-center gap-2 w-full rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-600/10"
                      >
                        <FaSignOutAlt className="w-4 h-4" /> {/* Logout Icon */}
                        Logout
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

// const Header: React.FC = () => {
//     return (
//       <header className="bg-[#1a4f9d] shadow-sm">
//         <div className="w-full py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-start">
//           <div className="flex items-center space-x-2">
//             <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 2048 2048" fill="#699bf7">
//               <rect width="2048" height="2048" fill="none" />
//               <path
//                 fill="white"
//                 d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
//               />
//             </svg>
//             <span className="text-2xl font-bold text-white">Dataset Editor</span>
//           </div>
//           {/* Add additional header content like buttons, navigation, etc. */}
//         </div>
//       </header>
//     );
//   };

//   export default Header;
