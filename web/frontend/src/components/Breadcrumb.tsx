import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse bg-white dark:bg-gray-800 h-10 px-2 py-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index === 0 ? (
              // Breadcrumb pertama (Home)
              <a
                href={item.href || "#"}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                {/* Home Icon */}
                <svg
                  className="w-4 h-4 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                {item.label}
              </a>
            ) : (
              <div className="flex items-center">
                {/* Panah separator */}
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>

                {/* Breadcrumb link atau teks */}
                {item.href ? (
                  <a
                    href={item.href}
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                    {item.label}
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;



// import React from "react";

// interface BreadcrumbItem {
//   label: string;
//   href?: string;
//   icon?: React.ReactNode;
//   isActive?: boolean;
// }

// interface BreadcrumbProps {
//   items: BreadcrumbItem[];
// }

// const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
//   <nav aria-label="Breadcrumb" className="flex">
//     <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300">
//       {items.map((item, index) => (
//         <li
//           key={index}
//           className={`flex items-center ${
//             item.isActive
//               ? "bg-[#1a4e9d] text-white"
//               : "bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300"
//           }`}
//         >
//           {item.href ? (
//             <a
//               href={item.href}
//               className={`flex h-10 items-center gap-1.5 px-4 ${
//                 index === 0 ? "" : "ps-8"
//               } text-xs font-medium transition hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white`}
//             >
//               {item.icon && <span className="w-4 h-4">{item.icon}</span>}
//               {item.label}
//             </a>
//           ) : (
//             <span
//               className={`flex h-10 items-center gap-1.5 px-4 ${
//                 index === 0 ? "" : "ps-8"
//               } text-xs font-medium`}
//             >
//               {item.icon && <span className="w-4 h-4">{item.icon}</span>}
//               {item.label}
//             </span>
//           )}
//         </li>
//       ))}
//     </ol>
//   </nav>
// );

// export default Breadcrumb;


// import React from "react";

// interface BreadcrumbItem {
//   label: string;
//   href?: string;
//   icon?: React.ReactNode;
//   isActive?: boolean;
// }

// interface BreadcrumbProps {
//   items: BreadcrumbItem[];
// }

// const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
//   <nav aria-label="Breadcrumb" className="flex">
//     <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300">
//       {items.map((item, index) => (
//         <li
//           key={index}
//           className={`flex items-center ${
//             item.isActive
//               ? "bg-[#1a4f9d] text-white"
//               : "bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300"
//           }`}
//         >
//           {item.href ? (
//             <a
//               href={item.href}
//               className={`flex h-10 items-center gap-1.5 px-4 ${
//                 index === 0 ? "" : "ps-8"
//               } text-xs font-medium transition hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white`}
//             >
//               {item.icon && <span className="size-4">{item.icon}</span>}
//               {item.label}
//             </a>
//           ) : (
//             <span
//               className={`flex h-10 items-center gap-1.5 px-4 ${
//                 index === 0 ? "" : "ps-8"
//               } text-xs font-medium`}
//             >
//               {item.icon && <span className="size-4">{item.icon}</span>}
//               {item.label}
//             </span>
//           )}
//         </li>
//       ))}
//     </ol>
//   </nav>
// );

// export default Breadcrumb;