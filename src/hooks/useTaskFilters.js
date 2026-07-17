import { useState, useEffect, useMemo } from 'react';

const PRIORITY_MAP = { high: 3, medium: 2, low: 1 };
const ITEMS_PER_PAGE = 6;

// Export thường để đảm bảo code toàn vẹn
export function useTaskFilters(initialTasks = []) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [statusFilter, setStatusFilter] = useState(() => {
    return localStorage.getItem('statusFilter') || 'all';
  });
  
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem('sortBy') || 'title-asc';
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  // Sync với LocalStorage
  useEffect(() => {
    localStorage.setItem('statusFilter', statusFilter);
    localStorage.setItem('sortBy', sortBy);
  }, [statusFilter, sortBy]);

  // Reset trang khi đổi bộ lọc
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  // Thuật toán Filter & Sort
  const processedTasks = useMemo(() => {
    let result = initialTasks.filter(task => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
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
  }, [initialTasks, searchTerm, statusFilter, sortBy]);

  // Cắt mảng phân trang
  const totalPages = Math.ceil(processedTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedTasks, currentPage]);

  // Hàm tiện ích hỗ trợ UI
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
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