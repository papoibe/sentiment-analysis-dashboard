import { useState, useMemo, useCallback } from 'react';

// useFilter — Hook lọc + tìm kiếm dùng chung
// Tập trung logic filter/search thay vì viết lặp ở mỗi page
// Params:
//   data: mảng dữ liệu gốc
//   searchFields: mảng tên field để tìm kiếm (VD: ['content', 'name'])
//   filterField: tên field để lọc theo dropdown (VD: 'sentiment', 'status')
// Returns:
//   filteredData: dữ liệu đã lọc
//   search, setSearch: giá trị tìm kiếm
//   filterValue, setFilterValue: giá trị bộ lọc
//   resetFilters: reset tất cả filter về mặc định
const useFilter = (data = [], searchFields = [], filterField = null) => {
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('ALL');

  const filteredData = useMemo(() => {
    let result = [...data];

    // Lọc theo filterField (dropdown)
    if (filterField && filterValue !== 'ALL') {
      result = result.filter((item) => item[filterField] === filterValue);
    }

    // Tìm kiếm theo searchFields (text input)
    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          return typeof val === 'string' && val.toLowerCase().includes(keyword);
        })
      );
    }

    return result;
  }, [data, search, filterValue, searchFields, filterField]);

  // Reset tất cả filter
  const resetFilters = useCallback(() => {
    setSearch('');
    setFilterValue('ALL');
  }, []);

  return {
    filteredData,
    search,
    setSearch,
    filterValue,
    setFilterValue,
    resetFilters,
  };
};

export default useFilter;
