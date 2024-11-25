import React, { useState, useEffect } from "react";

const RenderCard: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update the current date and time in Asia/Jakarta timezone
  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const jakartaTime = date.toLocaleString("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentDateTime(jakartaTime.replace(",", "")); // Remove the comma between date and time
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string) => {
    console.log(`Selected: ${option}`);
    setIsMenuOpen(false); // Close the menu after selection
  };

  return (
    <a
      href="#"
      className="block relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Card Image */}
      <div className="relative h-48 w-full">
        <img
          alt="Card preview"
          src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Three-dot Menu */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleMenu();
            }}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg focus:outline-none"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6h.01M12 12h.01M12 18h.01"
              />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10">
              <ul className="py-1 text-sm text-gray-700">
                <li
                  onClick={() => handleOptionClick("Settings")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </li>
                <li
                  onClick={() => handleOptionClick("Label")}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Label
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 bg-white">
        <dl>
          <div>
            <dt className="sr-only">DateTime</dt>
            <dd className="text-sm text-gray-500">{currentDateTime}</dd>
          </div>

          <div>
            <dt className="sr-only">Feature</dt>
            <dd className="font-medium text-gray-900">
              Automatic License Plate Recognition
            </dd>
          </div>
        </dl>

        {/* Additional Info */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <p>
              Parking: <span className="font-medium">2 spaces</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <p>
              Bathroom: <span className="font-medium">2 rooms</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <p>
              Bedroom: <span className="font-medium">4 rooms</span>
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default RenderCard;



// import React, { useState, useEffect } from "react";

// const RenderCard: React.FC = () => {
//   const [currentDateTime, setCurrentDateTime] = useState("");

//   // Update the current date and time in Asia/Jakarta timezone
//   useEffect(() => {
//     const updateDateTime = () => {
//       const date = new Date();
//       const jakartaTime = date.toLocaleString("en-CA", {
//         timeZone: "Asia/Jakarta",
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });
//       setCurrentDateTime(jakartaTime.replace(",", "")); // Remove the comma between date and time
//     };

//     updateDateTime();
//     const interval = setInterval(updateDateTime, 1000); // Update every second

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, []);

//   return (
//     <a
//       href="#"
//       className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
//     >
//       {/* Card Image */}
//       <div className="relative h-48 w-full">
//         <img
//           alt="Card preview"
//           src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
//           className="absolute inset-0 h-full w-full object-cover"
//         />
//       </div>

//       {/* Card Content */}
//       <div className="p-5 bg-white">
//         <dl>
//           <div>
//             <dt className="sr-only">DateTime</dt>
//             <dd className="text-sm text-gray-500">{currentDateTime}</dd>
//           </div>

//           <div>
//             <dt className="sr-only">Feature</dt>
//             <dd className="font-medium text-gray-900">
//               Automatic License Plate Recognition
//             </dd>
//           </div>
//         </dl>

//         {/* Additional Info */}
//         <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-700">
//           <div className="flex items-center gap-2">
//             <svg
//               className="w-4 h-4 text-indigo-700"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
//               />
//             </svg>
//             <p>Parking: <span className="font-medium">2 spaces</span></p>
//           </div>

//           <div className="flex items-center gap-2">
//             <svg
//               className="w-4 h-4 text-indigo-700"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
//               />
//             </svg>
//             <p>Bathroom: <span className="font-medium">2 rooms</span></p>
//           </div>

//           <div className="flex items-center gap-2">
//             <svg
//               className="w-4 h-4 text-indigo-700"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//               />
//             </svg>
//             <p>Bedroom: <span className="font-medium">4 rooms</span></p>
//           </div>
//         </div>
//       </div>
//     </a>
//   );
// };

// export default RenderCard;
