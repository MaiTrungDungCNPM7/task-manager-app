import { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import { Plus, Trash2, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

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
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const newTask = {
        title: newTitle,
        description: newDesc || 'Không có mô tả',
        status: 'todo',
        createdAt: new Date().toISOString()
      };
      
      const response = await taskService.createTask(newTask);
      setTasks([response.data, ...tasks]);
      setNewTitle('');
      setNewDesc('');
    } catch {
      alert('Không thể thêm task mới!');
    }
  };

  const handleMoveTask = async (id, currentStatus) => {
    let nextStatus = 'todo';
    if (currentStatus === 'todo' || currentStatus === 'status 1') nextStatus = 'in-progress';
    else if (currentStatus === 'in-progress' || currentStatus === 'status 2') nextStatus = 'done';
    
    try {
      const response = await taskService.updateTask(id, { status: nextStatus });
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch {
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch {
      alert('Xóa thất bại!');
    }
  };

  const getTasksByStatus = (statusType) => {
    return tasks.filter(task => {
      if (statusType === 'todo') return task.status === 'todo' || task.status === 'status 1' || !task.status;
      if (statusType === 'in-progress') return task.status === 'in-progress' || task.status === 'status 2';
      if (statusType === 'done') return task.status === 'done' || task.status === 'status 3';
      return false;
    });
  };

  return (
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
            <Column title="Cần Làm" icon={<ListTodo className="text-blue-500" />} count={getTasksByStatus('todo').length} bgColor="bg-blue-50">
              {getTasksByStatus('todo').map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onDelete={handleDeleteTask} btnText="Bắt đầu" btnColor="bg-blue-500 hover:bg-blue-600" />
              ))}
            </Column>

            <Column title="Đang Làm" icon={<Clock className="text-amber-500" />} count={getTasksByStatus('in-progress').length} bgColor="bg-amber-50">
              {getTasksByStatus('in-progress').map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMoveTask} onDelete={handleDeleteTask} btnText="Hoàn thành" btnColor="bg-amber-500 hover:bg-amber-600" />
              ))}
            </Column>

            <Column title="Hoàn Thành" icon={<CheckCircle2 className="text-emerald-500" />} count={getTasksByStatus('done').length} bgColor="bg-emerald-50">
              {getTasksByStatus('done').map(task => (
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
    <div className={`${bgColor} p-4 rounded-2xl flex flex-col min-h-[500px] border border-gray-100`}>
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">{icon} <span>{title}</span></div>
        <span className="bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-gray-500 border shadow-sm">{count}</span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
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
          <h3 className="font-semibold text-gray-800 text-sm leading-tight break-words flex-1">{task.title}</h3>
          <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 mb-4 line-clamp-3 break-words">{task.description}</p>
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