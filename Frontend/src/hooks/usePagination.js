import { useState, useMemo, useEffect } from 'react';

/**
 * Reusable client-side pagination hook.
 * @param {Array} data - Full data array to paginate.
 * @param {number} defaultPageSize - Default number of items per page.
 */
export const usePagination = (data = [], defaultPageSize = 10) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    // Reset to page 1 whenever the data or pageSize changes
    useEffect(() => {
        setPage(1);
    }, [data.length, pageSize]);

    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // Clamp page to valid range
    const currentPage = Math.min(page, totalPages);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, currentPage, pageSize]);

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return {
        page: currentPage,
        setPage,
        pageSize,
        setPageSize,
        paginatedData,
        totalPages,
        totalItems,
        startItem,
        endItem,
    };
};
