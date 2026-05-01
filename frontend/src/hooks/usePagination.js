import { useState, useMemo, useCallback } from 'react';

// usePagination — Hook phân trang dùng chung
// Thay vì viết logic phân trang lặp lại ở mỗi page (ReviewsPage, UserManagementPage, ...)
// Params:
//   data: mảng dữ liệu gốc
//   initialPageSize: số item/trang (mặc định 10)
// Returns:
//   pagedData: dữ liệu đã cắt theo trang hiện tại
//   currentPage, totalPages, pageSize
//   setCurrentPage, setPageSize: setter
//   resetPage: về trang 1
const usePagination = (data = [], initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Tính tổng số trang
  const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize]);

  // Cắt dữ liệu theo trang
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  // Reset về trang 1 (dùng khi filter/search thay đổi)
  const resetPage = useCallback(() => setCurrentPage(1), []);

  // Đổi pageSize và reset về trang 1
  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  return {
    pagedData,
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setPageSize: changePageSize,
    resetPage,
  };
};

export default usePagination;
