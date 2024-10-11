import { useState } from 'react';
import { FaPenFancy, FaVideo, FaImage, FaFileAlt, FaMusic, FaFilm, FaCalculator, FaCut, FaFile } from 'react-icons/fa';

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
    if (isOpen) {
      // Close all open menus when collapsing the sidebar
      setOpenMenus([]);
    }
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
      case 'Annotations':
        return <FaPenFancy className="w-6 h-6" />;
      case 'Video Editor':
        return <FaVideo className="w-6 h-6" />;
      case 'Image Editor':
        return <FaImage className="w-6 h-6" />;
      case 'Text Editor':
        return <FaFileAlt className="w-6 h-6" />;
      case 'Audio Editor':
        return <FaMusic className="w-6 h-6" />;
      case 'Video Editor 2':
        return <FaFilm className="w-6 h-6" />;
      case 'Numeric Data Editor':
        return <FaCalculator className="w-6 h-6" />;
      case 'Dataset Split':
        return <FaCut className="w-6 h-6" />;
      case 'Document Editor':
        return <FaFile className="w-6 h-6" />;
      default:
        return <FaFileAlt className="w-6 h-6" />;
    }
  };

  // Function to apply hover styles
  const applyHoverStyles = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.currentTarget;
    element.style.backgroundColor = 'var(--hover-blue)';
    element.style.color = 'white';
  };

  // Function to reset hover styles
  const resetHoverStyles = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.currentTarget;
    element.style.backgroundColor = '';
    element.style.color = 'var(--default-blue)';
  };

  return (
    <div className={`flex h-screen flex-col justify-between border-e bg-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="px-2 py-6">
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-center">
          {/* Clicking logo toggles sidebar */}
          <div className="flex items-center cursor-pointer" onClick={handleSidebarToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 2048 2048" fill="#699bf7" className="block">
              <rect width="2048" height="2048" fill="none" />
              <path
                fill="#699bf7"
                d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
              />
            </svg>
            <span style={{ color: 'var(--default-blue)' }} className={`text-xl font-bold ml-2 ${!isOpen && 'hidden'}`}>
              Dashboard
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="mt-6 space-y-1">
          {menuData.map((menuItem, index) => (
            <li key={index}>
              {menuItem.features ? (
                <details className="group [&_summary::-webkit-details-marker]:hidden" open={openMenus.includes(menuItem.name)}>
                  <summary
                    onClick={() => handleMenuToggle(menuItem.name)}
                    onMouseOver={applyHoverStyles}
                    onMouseOut={resetHoverStyles}
                    className={`flex cursor-pointer items-center justify-${isOpen ? 'start' : 'center'} rounded-lg px-2 py-2`}
                    style={{ color: 'var(--default-blue)' }}
                  >
                    <span className="flex items-center">
                      <div className={`flex justify-${isOpen ? 'start' : 'center'} items-center`} onClick={() => handleIconClick(menuItem.name)}>
                        {getMenuIcon(menuItem.name)}
                      </div>
                      <span className={`${!isOpen && 'hidden'} text-sm font-medium ml-2`}>{menuItem.name}</span>
                    </span>
                  </summary>
                  <ul className="mt-2 space-y-1 px-4">
                    {menuItem.features.map((subFeature: any, subIndex: number) => (
                      <li key={subIndex}>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                          <summary
                            onMouseOver={applyHoverStyles}
                            onMouseOut={resetHoverStyles}
                            className={`flex cursor-pointer items-center justify-${isOpen ? 'start' : 'center'} rounded-lg px-4 py-2`}
                            style={{ color: 'var(--default-blue)' }}
                          >
                            <span className={`${!isOpen && 'hidden'} text-sm font-medium`}>{subFeature.name}</span>
                          </summary>
                          <ul className="mt-2 space-y-1 px-4">
                            {subFeature.sub_features_1?.map((point: any, pointIndex: number) => (
                              <li key={pointIndex}>
                                <a
                                  href="#"
                                  className="block rounded-lg px-4 py-2 text-sm font-medium"
                                  style={{ color: 'var(--default-blue)' }}
                                  onClick={() => onMenuClick(point.name)}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--hover-blue)';
                                    e.currentTarget.style.color = 'white';
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = 'var(--default-blue)';
                                  }}
                                >
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
                <a
                  href="#"
                  className={`flex items-center justify-${isOpen ? 'start' : 'center'} rounded-lg px-2 py-2 text-sm font-medium`}
                  style={{ color: 'var(--default-blue)' }}
                  onClick={() => handleIconClick(menuItem.name)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--hover-blue)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = 'var(--default-blue)';
                  }}
                >
                  <div className="flex justify-center items-center">
                    {getMenuIcon(menuItem.name)}
                  </div>
                  <span className={`${!isOpen && 'hidden'} ml-2`}>{menuItem.name}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;


      // {/* User Section at the bottom */}
      // <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
      //   <a href="#" className="flex items-center justify-center gap-2 bg-white p-4 hover:bg-gray-50">
      //     <img
      //       alt=""
      //       src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
      //       className="w-10 h-10 rounded-full object-cover"
      //     />
      //     <div className={`${!isOpen && 'hidden'} ml-2`}>
      //       <p className="text-xs">
      //         <strong className="block font-medium" style={{ color: 'var(--default-blue)' }}>
      //           Febri Dwi Putro
      //         </strong>
      //         <span style={{ color: 'var(--default-blue)' }}> putrodwifebri@gmail.com </span>
      //       </p>
      //     </div>
      //   </a>
      // </div>


  // const getMenuIcon = (menuName: string) => {
  //   switch (menuName) {
  //     case 'Annotations':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m0-3l-3-3V4l3-3m0 0H4v7m3 5h7m5 5H7V4l5-5 5 5v3" />
  //         </svg>
  //       );
  //     case 'Video Editor':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8m-8 4h8m-8 4h8m4-4v.01M4 6V5a2 2 0 012-2h12a2 2 0 012 2v1" />
  //         </svg>
  //       );
  //     case 'Image Editor':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M9 3v18m6-18v18" />
  //         </svg>
  //       );
  //     case 'Text Editor':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16M4 10h16M4 15h8m-8 5h16" />
  //         </svg>
  //       );
  //     case 'Audio Editor':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l7 4v9" />
  //         </svg>
  //       );
  //     case 'Video Editor 2':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8m-8 4h8m-8 4h8m4-4v.01M4 6V5a2 2 0 012-2h12a2 2 0 012 2v1" />
  //         </svg>
  //       );
  //     case 'Numeric Data Editor':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 6h6M9 18h6" />
  //         </svg>
  //       );
  //     case 'Dataset Split':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h12v12H6z" />
  //         </svg>
  //       );
  //     case 'Document Editor':
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9m-9 0a1 1 0 01-1-1V5a1 1 0 011-1h4.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a1 1 0 01-1 1H12z" />
  //         </svg>
  //       );
  //     default:
  //       return (
  //         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v12l7-6 7 6V3H5z" />
  //         </svg>
  //       );
  //   }
  // };