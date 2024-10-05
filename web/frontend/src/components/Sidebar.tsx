import { useState } from 'react';

interface SidebarProps {
  menuData: any[];
  onMenuClick: (menuName: string) => void;
  selectedMenu: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuData, onMenuClick, selectedMenu }) => {
  const [isOpen, setIsOpen] = useState(true); // State to control sidebar toggle (open/close)
  const [openMenus, setOpenMenus] = useState<string[]>([]); // To manage open/close of submenus

  // Handle menu toggle for sub-menus
  const handleMenuToggle = (menuName: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuName) ? prev.filter((m) => m !== menuName) : [...prev, menuName]
    );
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  // Toggle sidebar when an icon is clicked while sidebar is minimized
  const handleIconClick = (menuName: string) => {
    if (!isOpen) {
      setIsOpen(true); // Expand sidebar
    } else {
      onMenuClick(menuName); // Call menu click if sidebar is already open
    }
  };

  // Icons for the menu items
  const getMenuIcon = (menuName: string) => {
    switch (menuName) {
      case 'Video Editor':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8m-8 4h8m-8 4h8m4-4v.01M4 6V5a2 2 0 012-2h12a2 2 0 012 2v1"
            />
          </svg>
        );
      case 'Dataset Split':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m0-3l-3-3V4l3-3m0 0H4v7m3 5h7m5 5H7V4l5-5 5 5v3"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3v12l7-6 7 6V3H5z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`flex h-screen flex-col justify-between border-e bg-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="px-4 py-6">
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-between">
          {/* Clicking logo toggles sidebar */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleSidebarToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 2048 2048" fill="#699bf7">
              <rect width="2048" height="2048" fill="none" />
              <path
                fill="#699bf7"
                d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
              />
            </svg>
            <span className={`text-xl font-bold text-[#85b6ff] ${!isOpen && 'hidden'}`}>Dashboard</span>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="mt-6 space-y-1">
          {menuData.map((menuItem, index) => (
            <li key={index}>
              {menuItem.sub_features ? (
                <details className="group [&_summary::-webkit-details-marker]:hidden" open={openMenus.includes(menuItem.name)}>
                  <summary
                    onClick={() => handleMenuToggle(menuItem.name)}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-[#85b6ff] hover:bg-[#699bf7] hover:text-white"
                  >
                    <span className="flex items-center space-x-2">
                      <div className={`flex justify-center items-center ${!isOpen ? 'w-full' : ''}`} onClick={() => handleIconClick(menuItem.name)}>
                        {getMenuIcon(menuItem.name)}
                      </div>
                      <span className={`${!isOpen && 'hidden'} text-sm font-medium`}>{menuItem.name}</span>
                    </span>
                    {isOpen && (
                      <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </summary>
                  <ul className="mt-2 space-y-1 px-4">
                    {menuItem.sub_features.map((subFeature: any, subIndex: number) => (
                      <li key={subIndex}>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-[#85b6ff] hover:bg-[#699bf7] hover:text-white">
                            <span className={`${!isOpen && 'hidden'} text-sm font-medium`}>{subFeature.name}</span>
                          </summary>
                          <ul className="mt-2 space-y-1 px-4">
                            {subFeature.points?.map((point: any, pointIndex: number) => (
                              <li key={pointIndex}>
                                <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-[#85b6ff] hover:bg-[#699bf7] hover:text-white" onClick={() => onMenuClick(point.name)}>
                                  {point.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <a href="#" className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-[#85b6ff] hover:bg-[#699bf7] hover:text-white">
                  <div className={`flex justify-center items-center ${!isOpen ? 'w-full' : ''}`} onClick={() => handleIconClick(menuItem.name)}>
                    {getMenuIcon(menuItem.name)}
                  </div>
                  <span className={`${!isOpen && 'hidden'}`}>{menuItem.name}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* User Section at the bottom */}
      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className={`${!isOpen && 'hidden'}`}>
            <p className="text-xs">
              <strong className="block font-medium text-[#85b6ff]">Febri Dwi Putro</strong>
              <span className="text-[#85b6ff]"> putrodwifebri@gmail.com </span>
            </p>
          </div>

          {!isOpen && (
            <div className="invisible absolute left-16 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded shadow-lg group-hover:visible">
              <p>Febri Dwi Putro</p>
              <p>putrodwifebri@gmail.com</p>
            </div>
          )}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;




// ########################################

// import { useState } from 'react';

// interface SidebarProps {
//   menuData: any[];
//   onMenuClick: (menuName: string) => void;
//   selectedMenu: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({ menuData, onMenuClick, selectedMenu }) => {
//   const [openMenus, setOpenMenus] = useState<string[]>([]);

//   const handleMenuToggle = (menuName: string) => {
//     setOpenMenus((prev) =>
//       prev.includes(menuName) ? prev.filter((m) => m !== menuName) : [...prev, menuName]
//     );
//   };

//   return (
//     <div className="flex h-screen flex-col justify-between border-e bg-white">
//       <div className="px-4 py-6">
//         <div className="flex items-center space-x-2">
//           <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 2048 2048" fill="#699bf7">
//             <rect width="2048" height="2048" fill="none" />
//             <path
//               fill="#699bf7"
//               d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
//             />
//           </svg>
//           <span className="text-xl font-bold text-[#85b6ff]">My Dashboard</span>
//         </div>

//         <ul className="mt-6 space-y-1">
//           {menuData.map((menuItem, index) => (
//             <li key={index}>
//               {menuItem.sub_features ? (
//                 <details className="group [&_summary::-webkit-details-marker]:hidden" open={openMenus.includes(menuItem.name)}>
//                   <summary
//                     onClick={() => handleMenuToggle(menuItem.name)}
//                     className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-[#85b6ff] hover:bg-[#699bf7] hover:text-white"
//                   >
//                     <span className="text-sm font-medium">{menuItem.name}</span>
//                     <span className="shrink-0 transition duration-300 group-open:-rotate-180">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                       </svg>
//                     </span>
//                   </summary>
//                   <ul className="mt-2 space-y-1 px-4">
//                     {menuItem.sub_features.map((subFeature: any, subIndex: number) => (
//                       <li key={subIndex}>
//                         <details className="group [&_summary::-webkit-details-marker]:hidden">
//                           <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-[#85b6ff] hover:bg-[#699bf7] hover:text-white">
//                             <span className="text-sm font-medium">{subFeature.name}</span>
//                           </summary>
//                           <ul className="mt-2 space-y-1 px-4">
//                             {subFeature.points?.map((point: any, pointIndex: number) => (
//                               <li key={pointIndex}>
//                                 <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-[#85b6ff] hover:bg-[#699bf7] hover:text-white" onClick={() => onMenuClick(point.name)}>
//                                   {point.name}
//                                 </a>
//                               </li>
//                             ))}
//                           </ul>
//                         </details>
//                       </li>
//                     ))}
//                   </ul>
//                 </details>
//               ) : (
//                 <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-[#85b6ff] hover:bg-[#699bf7] hover:text-white">
//                   {menuItem.name}
//                 </a>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
//         <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
//           <img
//             alt=""
//             src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
//             className="size-10 rounded-full object-cover"
//           />
//           <div>
//             <p className="text-xs">
//               <strong className="block font-medium">Eric Frusciante</strong>
//               <span> eric@frusciante.com </span>
//             </p>
//           </div>
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
