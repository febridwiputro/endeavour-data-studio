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
  <nav aria-label="Breadcrumb" className="flex">
    <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600">
      {items.map((item, index) => (
        <li
          key={index}
          className={`flex items-center ${
            index === 0 ? "bg-gray-100" : "bg-white"
          }`}
        >
          {/* {index > 0 && (
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"></span>
          )} */}
          {item.href ? (
            <a
              href={item.href}
              className={`flex h-10 items-center gap-1.5 px-4 ${
                index === 0 ? "" : "ps-8"
              } text-xs font-medium transition hover:text-gray-900`}
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
