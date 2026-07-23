import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

const PRIORITY_MAP = { high: 3, medium: 2, low: 1 };
const ITEMS_PER_PAGE = 6;

// Export thường để đảm bảo code toàn vẹn
export function useTaskFilters(initialTasks = []) {
  // Sử dụng useSearchParams để quản lý URL Query String
  const [searchParams, setSearchParams] = useSearchParams();

  // Khởi tạo State từ URL (nếu có)
  const initialSearch = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'title-asc';
  
  // State lưu từ khóa tức thì trong ô input (để gõ mượt mà)
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Tạo Debounced value: Chỉ cập nhật sau khi dừng gõ 400ms
  const debouncedSearch = useDebounce(searchTerm, 400);

  const currentPage = Number(searchParams.get('page')) || 1;

  // Đồng bộ State lên URL params khi debouncedSearch hoặc status, sort thay đổi
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Cập nhật search
    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    } else {
      params.delete('search');
    }

    // Cập nhật status
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    } else {
      params.delete('status');
    }

    // Cập nhật sort
    if (sortBy !== 'title-asc') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, statusFilter, sortBy, searchParams, setSearchParams]);

  // Reset về trang 1 khi các bộ lọc thay đổi
  const setCurrentPage = (page) => {
    const params = new URLSearchParams(searchParams);
    if (typeof page === 'function') {
      page = page(currentPage);
    }
    params.set('page', page.toString());
    setSearchParams(params, { replace: true });
  };

  const setStatusFilter = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status !== 'all') params.set('status', status);
    else params.delete('status');
    params.set('page', '1'); // Reset về trang 1
    setSearchParams(params, { replace: true });
  };

  const setSortBy = (sort) => {
    const params = new URLSearchParams(searchParams);
    if (sort !== 'title-asc') params.set('sort', sort);
    else params.delete('sort');
    params.set('page', '1'); // Reset về trang 1
    setSearchParams(params, { replace: true });
  };

  // Thuật toán Filter & Sort dùng useMemo tối ưu hiệu năng
  // Chỉ tính toán lại khi initialTasks, debouncedSearch, statusFilter hoặc sortBy thay đổi
  const processedTasks = useMemo(() => {
    let result = initialTasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'due-soon') return (Number(a.dueDate) || 0) - (Number(b.dueDate) || 0);
      if (sortBy === 'priority-high') {
        return (PRIORITY_MAP[b.priority] || 0) - (PRIORITY_MAP[a.priority] || 0);
      }
      return 0;
    });
  }, [initialTasks, statusFilter, debouncedSearch, sortBy]); // Mảng phụ thuộc của useMemo với các state cần check mỗi lần re-render

  // Cắt mảng phân trang
  const totalPages = Math.ceil(processedTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedTasks, currentPage]);

  // Hàm tiện ích hỗ trợ UI
  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({}, { replace: true });
  };

  // Trả về một Object chứa tất cả "nút bấm" để Dashboard điều khiển
  return {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
    currentPage, setCurrentPage,
    paginatedTasks, totalPages,
    totalItems: processedTasks.length,
    clearFilters
  };
}