import { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import TaskList from '../components/TaskList';
import { useTaskFilters } from '../hooks/useTaskFilters';

export default function Dashboard() {
  // 1. Quản lý dữ liệu gốc từ API
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useOutletContext();

  // 2. Quản lý Modal Xóa
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // 3. Lấy dữ liệu từ mockAPI
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();
      setTasks(response.data);
    } catch {
      showToast('Không thể lấy danh sách công việc từ server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //Fetch một lần duy nhất

  // 4. Đưa dữ liệu gốc vào Custom Hook để xử lý Filter, Sort & Pagination
  const {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
    currentPage, setCurrentPage,
    paginatedTasks, totalPages, totalItems,
    clearFilters
  } = useTaskFilters(tasks);

  // 5. Logic Xóa Task
  const handleOpenDeleteModal = (task) => {
    setTaskToDelete(task);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete.id);
      setTasks(tasks.filter(t => t.id !== taskToDelete.id)); // Xóa trên UI gốc, hook sẽ tự tính toán lại
      showToast('Xóa công việc thành công!');
    } catch {
      showToast('Xóa công việc thất bại!', 'error');
    } finally {
      setModalOpen(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* THANH CÔNG CỤ TÌM KIẾM & LỌC */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
          {/* Ô Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Lọc theo trạng thái */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-600 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="todo">Cần Làm</option>
                <option value="in-progress">Đang Làm</option>
                <option value="done">Hoàn Thành</option>
              </select>
            </div>

            {/* Sắp xếp dữ liệu */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-600 cursor-pointer"
              >
                <option value="title-asc">Tên (A-Z)</option>
                <option value="due-soon">Tới hạn gần nhất</option>
                <option value="priority-high">Ưu tiên: Cao hơn trước</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nút thêm mới */}
        <Link
          to="/tasks/new"
          className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Thêm công việc mới
        </Link>
      </div>
      
      {/* List */}
      {loading ? (
        <div className="text-center py-20 font-medium text-gray-500">Đang tải dữ liệu từ máy chủ...</div>
      ) : (
        <div className="space-y-4">
          <TaskList 
            tasks={paginatedTasks} 
            searchTerm={searchTerm} 
            statusFilter={statusFilter}
            onClearFilters={clearFilters}
            onDeleteTask={handleOpenDeleteModal} // Truyền hàm xóa xuống cho TaskList
          />

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100 mt-4">
              <span className="text-sm font-medium text-gray-600">
                Trang <b className="text-indigo-600">{currentPage}</b> / {totalPages} <span className="hidden sm:inline">(Tổng {totalItems} tác vụ)</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Xác nhận xóa */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={taskToDelete?.title || ''}
      />
    </div>
  );
}