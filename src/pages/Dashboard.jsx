import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { Plus, Trash2, CheckCircle2, Clock, ListTodo, Search, Filter } from 'lucide-react';

export default function Dashboard() {
  // State init
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
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
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault(); // Chặn load lại trang mỗi khi add thêm task
    if (!newTitle.trim()) return; // Nếu không có title được nhập thì khi add task sẽ bị chặn lại

    try {
      const newTask = {
        title: newTitle,
        description: newDesc || 'Không có mô tả',
        status: 'todo', // Trạng thái mặc định của thẻ việc sẽ là "todo" - cần làm.
        createdAt: new Date().toISOString() // Lưu date dưới dạng string
      };
      
      const response = await taskService.createTask(newTask); // Gửi https request tới server, thêm task mới tạo vào database với id => prev +1
      setTasks([response.data, ...tasks]); // Thêm phần tử mới vào mảng => Re-render
      setNewTitle(''); 
      setNewDesc(''); // Đặt lại trạng thái của hai trường nhập liệu này về rỗng
    } catch {
      alert('Không thể thêm task mới!');
    }
  };

  const handleMoveTask = async (id, currentStatus) => {
    let nextStatus = 'todo'; // Gán trạng thái của thẻ vào một biến tạm trong scope handleMoveTask này để xử lý
    if (currentStatus === 'todo' || currentStatus === 'status 1') nextStatus = 'in-progress'; 
    else if (currentStatus === 'in-progress' || currentStatus === 'status 2') nextStatus = 'done'; // Không thể nhảy cóc từ todo sang done mà phải chuyển từng bước một
    
    try {
      const response = await taskService.updateTask(id, { status: nextStatus });
      setTasks(tasks.map(task => task.id === id ? response.data : task)); // Gọi service thực hiện http put, update trạng thái dữ liệu trên database
    } catch {
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id)); // Trả lại một mảng mới mà không chứa phần tử có id đã được xóa (vẫn lưu ở database gốc chỉ là không hiển thị mà thôi)
    } catch {
      alert('Xóa thất bại!');
    }
  };

  // const getTasksByStatus = (statusType) => {
  //   return tasks.filter(task => {
  //     if (statusType === 'todo') return task.status === 'todo' || task.status === 'status 1' || !task.status;
  //     if (statusType === 'in-progress') return task.status === 'in-progress' || task.status === 'status 2';
  //     if (statusType === 'done') return task.status === 'done' || task.status === 'status 3';
  //     return false;
  //   });
  // };

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

      return matchesStatus && matchesSearch;
    });
  };

  // Hàm bổ trợ chia nhóm task vào 3 cột từ danh sách đã qua bộ lọc
  const getTasksByColumn = (columnType) => {
    const filtered = getFilteredTasks();
    return filtered.filter(task => {
      if (columnType === 'todo') return task.status === 'todo' || task.status === 'status 1' || !task.status;
      if (columnType === 'in-progress') return task.status === 'in-progress' || task.status === 'status 2';
      if (columnType === 'done') return task.status === 'done' || task.status === 'status 3';
      return false;
    });
  };

  return (
    <div className="space-y-6">
      {/* Thanh search và dropdown bar */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Ô Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc theo tên, mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
          />
        </div>

        {/* Ô Select Dropdown Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-600 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="todo">Cột Cần Làm</option>
            <option value="in-progress">Cột Đang Làm</option>
            <option value="done">Cột Hoàn Thành</option>
          </select>
        </div>
      </div>
      {/* Phần thân trang */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Thêm mới Task */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-500" /> Tạo Công Việc Mới
          </h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Tiêu đề</label>
              <input
                type="text"
                placeholder="Ví dụ: Học React Router..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Mô tả chi tiết</label>
              <textarea
                placeholder="Nhập nội dung cần làm..."
                rows="3"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl text-sm shadow-sm hover:bg-indigo-700 transition">
              Thêm công việc
            </button>
          </form>
        </div>

        {/* Board chính */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}

function Column({ title, icon, count, bgColor, children }) {
  return (
    <div className={`${bgColor} p-4 rounded-2xl flex flex-col min-h-125 border border-gray-100`}>
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">{icon} <span>{title}</span></div>
        <span className="bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-gray-500 border shadow-sm">{count}</span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto max-h-150 pr-1">
        {children.length === 0 ? <div className="text-center py-10 text-xs text-gray-400 italic">Trống</div> : children}
      </div>
    </div>
  );
}

function TaskCard({ task, onMove, onDelete, btnText, btnColor }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-2">
          {/* Bọc tiêu đề bằng thẻ Link để click xem chi tiết */}
          <Link 
            to={`/task/${task.id}`} 
            className="font-semibold text-gray-800 text-sm leading-tight wrap-break-word flex-1 hover:text-indigo-600 hover:underline transition decoration-2"
          >{task.title}</Link>
          <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 mb-4 line-clamp-3 wrap-break-word">{task.description}</p>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <span className="text-[10px] text-gray-400">ID: #{task.id}</span>
        <button onClick={() => onMove(task.id, task.status)} className={`text-white text-xs px-3 py-1.5 rounded-lg font-medium transition ${btnColor}`}>
          {btnText}
        </button>
      </div>
    </div>
  );
}