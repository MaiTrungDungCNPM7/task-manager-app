import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { Plus, Trash2, CheckCircle2, Clock, ListTodo, Search, Filter, Edit3, Eye } from 'lucide-react';

export default function Dashboard() {
  // State init
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State của hàm tìm và lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'todo', 'in-progress', 'done'

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks(); // Lấy cái này từ bên taskService, có nhiệm vụ fetch dữ liệu tất cả task về
      setTasks(response.data); // Cập nhật State bằng mảng dữ liệu mới
    } catch {
      alert('Không thể lấy danh sách công việc từ server.');
    } finally {
      setLoading(false); // Chuyển trạng thái loading về false => Đã load xong
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []); //fetch đúng một lần duy nhất

  const handleMoveTask = async (id, currentStatus) => {
    let nextStatus = 'todo'; // Gán trạng thái của thẻ vào một biến tạm trong scope handleMoveTask này để xử lý
    if (currentStatus === 'todo' || currentStatus === 'status 1') nextStatus = 'in-progress'; 
    else if (currentStatus === 'in-progress' || currentStatus === 'status 2') nextStatus = 'done'; // Không thể nhảy cóc từ todo sang done mà phải chuyển từng bước một
    
    try {
      const response = await taskService.updateTask(id, { status: nextStatus }); // Call api put, await, cập nhật trạng thái mới lên server
      setTasks(tasks.map(task => task.id === id ? response.data : task)); // Cập nhật lại giao diện theo data mới
    } catch {
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;
    try {
      await taskService.deleteTask(id); // Gọi api delete task theo id, xóa cứng dữ liệu trên database
      setTasks(tasks.filter(task => task.id !== id)); // Cập nhật lại state local, update UI theo dữ liệu mới (tạo mảng mới để render lại)
    } catch {
      alert('Xóa thất bại!');
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Chuẩn hóa chuỗi trạng thái từ mockAPI về 3 nhóm chính cơ bản
      let normalizedStatus = 'todo';
      if (task.status === 'in-progress' || task.status === 'status 2') normalizedStatus = 'in-progress';
      if (task.status === 'done' || task.status === 'status 3') normalizedStatus = 'done';

      // Điều kiện lọc theo Trạng thái Dropdown tổng
      const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;

      // Điều kiện lọc theo từ khóa tìm kiếm (Search Input)
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch; // Đảm bảo nếu vừa search input vừa có filter thì vẫn hiển thị thỏa mãn cả hai
    });
  };

  // Hàm bổ trợ chia nhóm task vào 3 cột từ danh sách đã qua bộ lọc
  const getTasksByColumn = (columnType) => {
    const filtered = getFilteredTasks();
    return filtered.filter(task => {
      if (columnType === 'todo') return task.status === 'todo' || task.status === 'status 1' || !task.status; // Task không có trạng thái cũng có thể được gom luôn vào cột 1
      if (columnType === 'in-progress') return task.status === 'in-progress' || task.status === 'status 2';
      if (columnType === 'done') return task.status === 'done' || task.status === 'status 3';
      return false;
    });
  };

  return (
    <div className="space-y-6">
      {/* Thanh filter + Nút tạo mới trên đầu */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Ô Search + Dropdown menu */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm công việc theo tên, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
            />
          </div>

        {/* Ô Select Dropdown Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-600 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="todo">Cột Cần Làm</option>
              <option value="in-progress">Cột Đang Làm</option>
              <option value="done">Cột Hoàn Thành</option>
            </select>
          </div>
        </div>

        {/* Nút thêm mới (Có chuyển trang) */}
        <Link
          to="/tasks/new"
          className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Thêm công việc mới
        </Link>
      </div>
      
        {/* Task Board chính */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-20 font-medium text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <>
            <Column title="Cần Làm" icon={<ListTodo className="text-blue-500" />} count={getTasksByColumn('todo').length} bgColor="bg-blue-50">
              {getTasksByColumn('todo').map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onDelete={handleDeleteTask} btnText="Bắt đầu" btnColor="bg-blue-500 hover:bg-blue-600" />
              ))}
            </Column>

            <Column title="Đang Làm" icon={<Clock className="text-amber-500" />} count={getTasksByColumn('in-progress').length} bgColor="bg-amber-50">
              {getTasksByColumn('in-progress').map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onDelete={handleDeleteTask} btnText="Hoàn thành" btnColor="bg-amber-500 hover:bg-amber-600" />
              ))}
            </Column>

            <Column title="Hoàn Thành" icon={<CheckCircle2 className="text-emerald-500" />} count={getTasksByColumn('done').length} bgColor="bg-emerald-50">
              {getTasksByColumn('done').map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onDelete={handleDeleteTask} btnText="Làm lại" btnColor="bg-gray-500 hover:bg-gray-600" />
              ))}
            </Column>
          </>
        )}
      </div>
    </div>
  );
}

function Column({ title, icon, count, bgColor, children }) {
  return (
    <div className={`${bgColor} p-4 rounded-2xl flex flex-col min-h-125 border border-gray-100/80 shadow-xs`}>
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2 font-bold text-gray-700 text-base">{icon} <span>{title}</span></div>
        <span className="bg-white px-3 py-0.5 rounded-full text-xs font-bold text-gray-500 border shadow-xs">{count}</span>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto max-h-175 pr-1">
        {children.length === 0 ? <div className="text-center py-14 text-sm text-gray-400 italic">Trống</div> : children}
      </div>
    </div>
  );
}

function TaskCard({ task, onMove, onDelete, btnText, btnColor }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-md transition duration-300 flex flex-col justify-between min-h-47.5">
      <div>
        <div className="flex justify-between items-start gap-3">
          {/* Tiêu đề */}
          <Link 
            to={`/task/${task.id}`} 
            className="font-bold text-gray-800 text-base leading-snug wrap-break-word flex-1 hover:text-indigo-600 hover:underline transition decoration-2"
          >
            {task.title}
          </Link>
          
          {/* Nút Xóa */}
          <button 
            onClick={() => onDelete(task.id)} 
            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
            title="Xóa công việc"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
        
        {/* Mô tả */}
        <p className="text-sm text-gray-500 mt-2.5 mb-6 line-clamp-2 wrap-break-word leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Footer của thẻ nơi bố trí các nút */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
        {/* Nút Sửa (Edit) dẫn trực tiếp sang trang Edit */}
        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/${task.id}/edit`} 
            className="text-gray-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition flex items-center gap-1 text-xs font-semibold"
            title="Chỉnh sửa công việc"
          >
            <Edit3 className="w-4 h-4" /> Sửa
          </Link>
          <Link
            to={`/task/${task.id}`} // Chuyển hướng sang trang xem chi tiết theo id
            className="text-gray-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition flex items-center gap-1 text-xs font-semibold"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" /> Xem
          </Link>
        </div>

        {/* Nút Chuyển Trạng Thái */}
        <button 
          onClick={() => onMove(task.id, task.status)} 
          className={`text-white text-xs px-3.5 py-2 rounded-xl font-bold transition shadow-xs ${btnColor}`}
        >
          {btnText}
        </button>
      </div>
    </div>
  );
}