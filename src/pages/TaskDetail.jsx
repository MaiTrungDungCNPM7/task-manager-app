import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { ArrowLeft, Calendar, Tag, CheckCircle } from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams(); // Lấy ':id' từ URL thanh địa chỉ
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        const response = await taskService.getTaskById(id);
        setTask(response.data);
      } catch {
        alert('Không tìm thấy công việc này hoặc đã có lỗi xảy ra!');
        navigate('/'); // Đẩy người dùng về trang chủ nếu lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetail();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Đang tải chi tiết công việc...</div>;
  if (!task) return null;

  // Định nghĩa màu sắc hiển thị tương ứng trạng thái
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
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border shadow-sm p-6 md:p-8 mt-6">
      {/* Nút Quay Lại */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 font-medium mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>

      {/* Nội dung chi tiết */}
      <div className="space-y-6">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentStatus.color}`}>
            <CheckCircle className="w-3.5 h-3.5" /> {currentStatus.label}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-3 wrap-break-word leading-tight">{task.title}</h1>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Mô tả chi tiết</h3>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100/50 min-h-25 wrap-break-word whitespace-pre-line">
            {task.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2.5 text-gray-500">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Ngày tạo</p>
              <p className="text-xs font-medium">{task.createdAt ? new Date(task.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-gray-500">
            <Tag className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Task ID</p>
              <p className="text-xs font-mono font-bold">#{task.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}