import React, { useEffect, useState } from "react";
import { usePagination, PaginationResponse } from "@/utils/usePagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface Item {
  id: number;
  name: string;
}

const PaginatedList: React.FC = () => {
  const { page, perPage, setPage, setPerPage, formatResponse } = usePagination();
  const [data, setData] = useState<PaginationResponse<Item> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/items?page=${page}&perPage=${perPage}`);
      const result = await response.json();
      const {
        data: items,
        pagination: { total_items, total_pages, next_page, previous_page },
      } = result;
      setData(
        formatResponse(
          items,
          total_items,
          total_pages,
          next_page ? parseInt(next_page) : null,
          previous_page ? parseInt(previous_page) : null
        )
      );
    };
    fetchData();
  }, [page, perPage]);

  if (!data) return <p>Loading...</p>;

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const { total_pages } = data.pagination;

    for (let i = 1; i <= total_pages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Paginated List</h1>
      <ul>
        {data.data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{(page - 1) * perPage + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * perPage, data.pagination.total_items)}
              </span>{" "}
              of <span className="font-medium">{data.pagination.total_items}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              aria-label="Pagination"
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            >
              <button
                onClick={() => setPage(page - 1)}
                disabled={!data.pagination.previous_page}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {generatePageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    pageNumber === page
                      ? "z-10 bg-indigo-600 text-white focus:z-20"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={!data.pagination.next_page}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginatedList;



// import React, { useEffect, useState } from "react";
// import { usePagination, PaginationResponse } from "@/utils/usePagination";

// interface Item {
//   id: number;
//   name: string;
// }

// const PaginatedList: React.FC = () => {
//   const { page, perPage, setPage, setPerPage, formatResponse } = usePagination();
//   const [data, setData] = useState<PaginationResponse<Item> | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch(
//         `/api/items?page=${page}&perPage=${perPage}`
//       );
//       const result = await response.json();
//       const { data: items, total_items, total_pages, next_page, previous_page } =
//         result.pagination;
//       setData(
//         formatResponse(
//           items,
//           total_items,
//           total_pages,
//           next_page ? parseInt(next_page) : null,
//           previous_page ? parseInt(previous_page) : null
//         )
//       );
//     };
//     fetchData();
//   }, [page, perPage]);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Paginated List</h1>
//       <ul>
//         {data.data.map((item) => (
//           <li key={item.id}>{item.name}</li>
//         ))}
//       </ul>
//       <div>
//         <button onClick={() => setPage(page - 1)} disabled={!data.pagination.previous_page}>
//           Previous
//         </button>
//         <button onClick={() => setPage(page + 1)} disabled={!data.pagination.next_page}>
//           Next
//         </button>
//         <select
//           value={perPage}
//           onChange={(e) => setPerPage(Number(e.target.value))}
//         >
//           <option value={5}>5</option>
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default PaginatedList;
