import React, { useEffect, useState } from "react";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/router";
import axios from "axios";

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
  const dispatch = useDispatch();
  const router = useRouter();
  const [profile, setProfile] = useState<{
    email: string;
    full_name: string | null;
    user_photo: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token is missing. Redirecting to login...");
          dispatch(logout());
          router.push("/login");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Extract data from the standardized response
        const profileData = response.data.data;
        setProfile({
          email: profileData.email,
          full_name: profileData.full_name,
          user_photo: profileData.user_photo,
        });
      } catch (error: any) {
        if (error?.response?.status === 401) {
          console.error("Token invalid or expired. Redirecting to login...");
          dispatch(logout());
          router.push("/login");
        } else {
          console.error("Failed to fetch profile:", error.message || error);
        }
      }
    };

    fetchProfile();
  }, [dispatch, router]);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token = localStorage.getItem("accessToken");
  //       if (!token) {
  //         console.error("Access token missing. Redirecting to login...");
  //         dispatch(logout());
  //         router.push("/login");
  //         return;
  //       }
  
  //       const response = await axios.get("http://127.0.0.1:8000/user/me", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setProfile(response.data.data);
  //     } catch (error: any) {
  //       if (error.response?.status === 401) {
  //         console.error("Invalid or expired token. Redirecting...");
  //         dispatch(logout());
  //         router.push("/login");
  //       } else {
  //         console.error("Failed to fetch profile:", error.message || error);
  //       }
  //     }
  //   };
  
  //   fetchProfile();
  // }, [dispatch, router]);
  

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="relative">
      {profile && (
        <button
          onClick={toggleProfileMenu}
          className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow hover:shadow-lg focus:outline-none"
        >
          <img
            src={profile.user_photo || "/default-avatar.png"} // Fallback image if user_photo is null
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
          {isOpen && (
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {profile.full_name || "Guest"}
            </span>
          )}
        </button>
      )}
      {isProfileMenuOpen && (
        <div className="absolute left-1 top-0 transform -translate-y-full w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={profile?.user_photo || "/default-avatar.png"} // Fallback image if user_photo is null
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {profile?.full_name || "Guest"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{profile?.email}</p>
              </div>
            </div>
            <hr className="border-gray-200 dark:border-gray-700 mb-4" />
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaUser className="w-4 h-4" />
              Profile
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaCog className="w-4 h-4" />
              Settings
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;



// import React, { useEffect, useState } from "react";
// import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { logout } from "@/features/auth/authSlice";
// import { useRouter } from "next/router";
// import axios from "axios";

// interface ProfileInfoProps {
//   isProfileMenuOpen: boolean;
//   toggleProfileMenu: () => void;
//   isOpen: boolean;
// }

// const ProfileInfo: React.FC<ProfileInfoProps> = ({
//   isProfileMenuOpen,
//   toggleProfileMenu,
//   isOpen,
// }) => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [profile, setProfile] = useState<{
//     email: string;
//     full_name: string | null;
//     user_photo: string | null;
//   } | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const response = await axios.get("http://127.0.0.1:8000/user/me", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         // Extract data from the standardized response
//         const profileData = response.data.data;
//         setProfile({
//           email: profileData.email,
//           full_name: profileData.full_name,
//           user_photo: profileData.user_photo,
//         });
//       } catch (error) {
//         console.error("Failed to fetch profile:", error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     router.push("/login"); // Redirect to login page
//   };

//   return (
//     <div className="relative">
//       {profile && (
//         <button
//           onClick={toggleProfileMenu}
//           className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow hover:shadow-lg focus:outline-none"
//         >
//           <img
//             src={profile.user_photo || "/default-avatar.png"} // Fallback image if user_photo is null
//             alt="Profile"
//             className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
//           />
//           {isOpen && (
//             <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
//               {profile.full_name || "Guest"}
//             </span>
//           )}
//         </button>
//       )}
//       {isProfileMenuOpen && (
//         <div className="absolute left-1 top-0 transform -translate-y-full w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
//           <div className="p-4">
//             <div className="flex items-center space-x-3 mb-4">
//               <img
//                 src={profile?.user_photo || "/default-avatar.png"} // Fallback image if user_photo is null
//                 alt="Profile"
//                 className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
//               />
//               <div>
//                 <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
//                   {profile?.full_name || "Guest"}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">{profile?.email}</p>
//               </div>
//             </div>
//             <hr className="border-gray-200 dark:border-gray-700 mb-4" />
//             <a
//               href="#"
//               className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
//             >
//               <FaUser className="w-4 h-4" />
//               Profile
//             </a>
//             <a
//               href="#"
//               className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
//             >
//               <FaCog className="w-4 h-4" />
//               Settings
//             </a>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700"
//             >
//               <FaSignOutAlt className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileInfo;


// // ProfileInfo.tsx

// import React, { useEffect, useState } from "react";
// import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { logout } from "@/features/auth/authSlice";
// import { useRouter } from "next/router";
// import axios from "axios";

// interface ProfileInfoProps {
//   isProfileMenuOpen: boolean;
//   toggleProfileMenu: () => void;
//   isOpen: boolean;
// }

// const ProfileInfo: React.FC<ProfileInfoProps> = ({
//   isProfileMenuOpen,
//   toggleProfileMenu,
//   isOpen,
// }) => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [profile, setProfile] = useState<{
//     full_name: string;
//     user_photo: string;
//   } | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const response = await axios.get("http://127.0.0.1:8000/user/me", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProfile({
//           full_name: response.data.full_name,
//           user_photo: response.data.user_photo,
//         });
//       } catch (error) {
//         console.error("Failed to fetch profile:", error);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     router.push("/login"); // Redirect to login page
//   };

//   return (
//     <div className="relative">
//       {profile && (
//         <button
//           onClick={toggleProfileMenu}
//           className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow hover:shadow-lg focus:outline-none"
//         >
//           <img
//             src={profile.user_photo}
//             alt="Profile"
//             className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
//           />
//           {isOpen && (
//             <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
//               {profile.full_name}
//             </span>
//           )}
//         </button>
//       )}
//       {isProfileMenuOpen && (
//         <div
//           className="absolute left-1 top-0 transform -translate-y-full w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50"
//         >
//           <div className="p-4">
//             <div className="flex items-center space-x-3 mb-4">
//               <img
//                 src={profile?.user_photo}
//                 alt="Profile"
//                 className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
//               />
//               <div>
//                 <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
//                   {profile?.full_name}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
//               </div>
//             </div>
//             <hr className="border-gray-200 dark:border-gray-700 mb-4" />
//             <a
//               href="#"
//               className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
//             >
//               <FaUser className="w-4 h-4" />
//               Profile
//             </a>
//             <a
//               href="#"
//               className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
//             >
//               <FaCog className="w-4 h-4" />
//               Settings
//             </a>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700"
//             >
//               <FaSignOutAlt className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileInfo;