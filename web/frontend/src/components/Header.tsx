const Header: React.FC = () => {
    return (
      <header className="bg-white shadow-sm">
        <div className="w-full py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-start">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 2048 2048" fill="#699bf7">
              <rect width="2048" height="2048" fill="none" />
              <path
                fill="#699bf7"
                d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
              />
            </svg>
            <span className="text-2xl font-bold text-[#85b6ff]">DE</span>
          </div>
          {/* Add additional header content like buttons, navigation, etc. */}
        </div>
      </header>
    );
  };
  
  export default Header;
  