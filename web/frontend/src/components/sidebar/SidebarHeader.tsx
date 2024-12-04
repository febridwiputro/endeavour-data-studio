import React from "react";

interface SidebarHeaderProps {
  isOpen: boolean;
  handleSidebarToggle: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isOpen,
  handleSidebarToggle,
}) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="flex items-center cursor-pointer"
        onClick={handleSidebarToggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 2048 2048"
          fill="currentColor"
          className="block text-[#699bf7] dark:text-blue-400"
        >
          <rect width="2048" height="2048" fill="none" />
          <path
            fill="currentColor"
            d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
          />
        </svg>
        <span
          className={`text-xl font-bold ml-2 text-gray-800 dark:text-gray-200 ${
            !isOpen && "hidden"
          }`}
        >
          Data Studio
        </span>
      </div>
    </div>
  );
};

export default SidebarHeader;
