import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { ArrowLeft, Save, AlertCircle, Calendar, AlertTriangle } from 'lucide-react';

export default function TaskFormPage() {
  const { id } = useParams(); // Lấy ID nếu đang ở chế độ Edit
  const isEditMode = !!id; // Chuyển đổi ép kiểu thành boolean (true nếu có id, ngược lại là false)
  const navigate = useNavigate();

  // State lưu trữ dữ liệu form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo'); // Mặc định là todo khi tạo mới
  const [priority, setPriority] = useState('low');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  // State quản lý lỗi Validation
  const [errors, setErrors] = useState({ title: '', description: '', dueDate: '' });

  // Nếu ở chế độ Edit, fetch dữ liệu cũ về đổ vào Form
  useEffect(() => {
    if (!isEditMode) return;

    const controller = new AbortController(); // Tạo tín hiệu hủy

    if (isEditMode) {
      const fetchTask = async () => {
        try {
          setLoading(true);
          const response = await taskService.getTaskById(id);
          const task = response.data;

          setTitle(response.data.title);
          setDescription(response.data.description);
          setStatus(response.data.status || 'todo');
          setPriority(task.priority || 'low');

          // Ép kiểu ngược từ chuỗi số Timestamp về 'YYYY-MM-DD' cho thẻ input
          if (task.dueDate) {
            const dateObj = new Date(Number(task.dueDate));
            if (!isNaN(dateObj.getTime())) {
               // Chuyển thành định dạng YYYY-MM-DD
               const yyyy = dateObj.getFullYear();
               const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
               const dd = String(dateObj.getDate()).padStart(2, '0');
               setDueDate(`${yyyy}-${mm}-${dd}`);
            }
          }
        } catch (err) {
          if (err.name !== 'CanceledError') { // Tránh alert nếu chủ động hủy
            alert('Không thể tải thông tin công việc!');
            navigate('/tasks'); // Khi chỉnh sửa xong và xác nhận sẽ chuyển hướng về lại trang dashboard task chính
          } 
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
      // Hàm dọn rác
      return () => {
        controller.abort(); // Hủy request nếu component bị unmount giữa chừng
      };
    }
  }, [id, isEditMode, navigate]);

  // Logic Validate dữ liệu trước khi gửi đi
  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', description: '' };

    if (!title.trim()) {
      newErrors.title = 'Tiêu đề công việc không được để trống!';
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = 'Mô tả chi tiết không được để trống!';
      isValid = false;
    }
    if (!dueDate) {
      newErrors.dueDate = 'Vui lòng chọn ngày tới hạn!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Xử lý sự kiện Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Nếu dữ liệu nhập vào không hợp lệ thì chặn lại không gửi API
    if (!validateForm()) return;

    try {
      setLoading(true);

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        // Ép kiểu từ 'YYYY-MM-DD' thành chuỗi Timestamp để lưu vào Database
        dueDate: new Date(dueDate).getTime().toString(),
        createdAt: isEditMode ? undefined : new Date().toISOString(), // Chỉ thêm ngày tạo khi làm mới
      };

      if (isEditMode) {
        // Gửi PUT để cập nhật
        await taskService.updateTask(id, taskData);
      } else {
        // Gửi POST để tạo mới
        await taskService.createTask(taskData);
      }

      // Redirect về trang danh sách chính sau khi thành công
      navigate('/tasks');
    } catch {
      alert(isEditMode ? 'Cập nhật công việc thất bại!' : 'Tạo công việc thất bại!');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center py-20 font-medium text-gray-500">Đang tải thông tin công việc...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border shadow-sm p-6 md:p-8 mt-6">
      <Link to="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200 hover:text-indigo-600 font-medium mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>

      <h1 className="text-2xl font-black text-gray-900 dark:text-gray-200 mb-6">
        {isEditMode ? 'Chỉnh Sửa Công Việc' : 'Tạo Công Việc Mới'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tiêu Đề */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-200 mb-2">Tiêu đề công việc</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            placeholder="Nhập tiêu đề..."
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm text-gray-600 dark:text-gray-200 transition ${
              errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
            </p>
          )}
        </div>

        {/* Khối chia đôi: Priority & Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mức độ ưu tiên */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-200 mb-2 md:flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Mức độ ưu tiên
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-900 cursor-pointer"
            >
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
            </select>
          </div>

          {/* Ngày tới hạn */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-200 mb-2 md:flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 "/> Ngày tới hạn
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm transition ${
                errors.dueDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.dueDate}
              </p>
            )}
          </div>
        </div>

        {/* Lựa chọn trạng thái */}
        {isEditMode && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-200 mb-2">Trạng thái hiện tại</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-900 cursor-pointer"
            >
              <option value="todo">Cần làm</option>
              <option value="in-progress">Đang làm</option>
              <option value="done">Hoàn thành</option>
            </select>
          </div>
        )}

        {/* Mô Tả */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-200 mb-2">Mô tả chi tiết</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            placeholder="Nhập mô tả chi tiết..."
            rows="5"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm resize-none transition ${
              errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500'
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" /> {loading ? 'Đang lưu...' : 'Lưu công việc'}
        </button>
      </form>
    </div>
  );
}