// utils/usePagination.ts

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginationResponse<T> {
  status: string;
  status_code: number;
  message_code: string;
  data: T[];
  pagination: {
    total_items: number;
    total_pages: number;
    max_items_per_page: number;
    next_page?: string | null;
    previous_page?: string | null;
  };
  timestamp: string;
}

export function usePagination(defaultPerPage: number = 10) {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(defaultPerPage);

  useEffect(() => {
    const currentPage = parseInt(router.query.page as string) || 1;
    const currentPerPage = parseInt(router.query.perPage as string) || defaultPerPage;
    setPage(currentPage);
    setPerPage(currentPerPage);
  }, [router.query.page, router.query.perPage, defaultPerPage]);

  const updatePagination = (newPage: number, newPerPage?: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: newPage,
        perPage: newPerPage || perPage,
      },
    });
  };

  const formatResponse = <T>(
    data: T[],
    totalItems: number,
    totalPages: number,
    nextPage: number | null,
    previousPage: number | null
  ): PaginationResponse<T> => {
    return {
      status: "success",
      status_code: 200,
      message_code: "PAGINATION_SUCCESS",
      data,
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        max_items_per_page: perPage,
        next_page: nextPage ? `/path?page=${nextPage}&perPage=${perPage}` : null,
        previous_page: previousPage
          ? `/path?page=${previousPage}&perPage=${perPage}`
          : null,
      },
      timestamp: new Date().toISOString(),
    };
  };

  return {
    page,
    perPage,
    setPage: (newPage: number) => updatePagination(newPage),
    setPerPage: (newPerPage: number) => updatePagination(1, newPerPage),
    formatResponse,
  };
}


// // utils/usePagination.ts
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";

// export interface PaginationParams {
//   page: number;
//   perPage: number;
// }

// export interface PaginationResult<T> {
//   data: T[];
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
//   nextPage?: number;
//   previousPage?: number;
// }

// export function usePagination(defaultPerPage: number = 10) {
//   const router = useRouter();
//   const [page, setPage] = useState<number>(1);
//   const [perPage, setPerPage] = useState<number>(defaultPerPage);

//   useEffect(() => {
//     const currentPage = parseInt(router.query.page as string) || 1;
//     const currentPerPage = parseInt(router.query.perPage as string) || defaultPerPage;
//     setPage(currentPage);
//     setPerPage(currentPerPage);
//   }, [router.query.page, router.query.perPage, defaultPerPage]);

//   const updatePagination = (newPage: number, newPerPage?: number) => {
//     router.push({
//       pathname: router.pathname,
//       query: {
//         ...router.query,
//         page: newPage,
//         perPage: newPerPage || perPage,
//       },
//     });
//   };

//   return {
//     page,
//     perPage,
//     setPage: (newPage: number) => updatePagination(newPage),
//     setPerPage: (newPerPage: number) => updatePagination(1, newPerPage),
//   };
// }
