import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { ArrowLeft, Calendar, Tag, CheckCircle, Edit3, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import NotFound from './NotFound';
import { useApp } from '../context/AppContext';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Lấy hàm showToast từ AppContext
  const { showToast } = useApp();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error404, setError404] = useState(false); // State kiểm soát lỗi không tìm thấy task
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Confirm Modal

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        const response = await taskService.getTaskById(id);
        setTask(response.data);
      } catch {
        setError404(true); // Gắn cờ lỗi nếu server báo lỗi (thường là 404) 
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetail();
  }, [id]);

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(id);
      setIsModalOpen(false);
      showToast('Xóa công việc thành công!'); // Bắn Toast báo thành công
      navigate('/tasks'); // Chuyển trang về Dashboard
    } catch {
      showToast('Xóa thất bại, vui lòng thử lại!', 'error');
    }
  };

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Đang tải chi tiết công việc...</div>;
  
  // Nếu task không tồn tại, trả về trang lỗi 404 
  if (error404 || !task) {
    return <NotFound message="Mã công việc (Task ID) này không tồn tại trên hệ thống dữ liệu." />;
  }

  const statusConfig = {
    'todo': { label: 'Cần làm', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    'status 1': { label: 'Cần làm', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    'in-progress': { label: 'Đang làm', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    'status 2': { label: 'Đang làm', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    'done': { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    'status 3': { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  };

  const currentStatus = statusConfig[task.status] || { label: 'Chưa rõ', color: 'bg-gray-100 text-gray-800' };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border shadow-sm p-6 md:p-8 mt-6">
      {/* Thanh điều hướng quay lại */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 font-medium transition">
          <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
        </Link>
        
        {/* Nút Edit và Delete */}
        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/${task.id}/edit`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-700 border border-gray-200 hover:border-indigo-500 text-gray-600 dark:text-gray-200 hover:text-indigo-600 rounded-xl text-xs font-bold transition"
          >
            <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa bỏ
          </button>
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <div className="space-y-6">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentStatus.color}`}>
            <CheckCircle className="w-3.5 h-3.5" /> {currentStatus.label}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-200 mt-3 wrap-break-word leading-tight">{task.title}</h1>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200 mb-2">Mô tả chi tiết</h3>
          <p className="text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-sm leading-relaxed border border-gray-100/50 min-h-25 wrap-break-word whitespace-pre-line">
            {task.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-200">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-200">Ngày tạo</p>
              <p className="text-xs font-medium">{task.createdAt ? new Date(task.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-200">
            <Tag className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-200">Task ID</p>
              <p className="text-xs font-mono font-bold">#{task.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Xác nhận xóa */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={task.title}
      />
    </div>
  );
}