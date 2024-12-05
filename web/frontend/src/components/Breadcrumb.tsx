import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <nav
    aria-label="Breadcrumb"
    className="flex"
  >
    <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300">
      {items.map((item, index) => (
        <li
          key={index}
          className={`flex items-center ${
            index === 0
              ? "bg-[#1a4f9d] text-white"
              : "bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {item.href ? (
            <a
              href={item.href}
              className={`flex h-10 items-center gap-1.5 px-4 ${
                index === 0 ? "" : "ps-8"
              } text-xs font-medium transition hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white`}
            >
              {item.icon && <span className="size-4">{item.icon}</span>}
              {item.label}
            </a>
          ) : (
            <span
              className={`flex h-10 items-center gap-1.5 px-4 ${
                index === 0 ? "" : "ps-8"
              } text-xs font-medium`}
            >
              {item.icon && <span className="size-4">{item.icon}</span>}
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
