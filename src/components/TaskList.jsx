// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Calendar, AlertTriangle, Edit3, Trash2 } from 'lucide-react';

export default function TaskList({ 
  tasks, 
  searchTerm, 
  statusFilter, 
  onClearFilters,
  onDeleteTask // Nhận hàm xóa từ Dashboard truyền xuống
}) {
  // Nếu không có phần tử nào phù hợp
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
        <Inbox className="h-16 w-16 text-gray-300 dark:text-gray-800 mb-4 animate-bounce" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Không tìm thấy kết quả nào</h3>
        <p className="text-gray-500 dark:text-gray-200 text-sm mt-1 max-w-xs text-center">
          Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại các bộ lọc hiện tại.
        </p>
        {(searchTerm || statusFilter !== 'all') && (
          <button
            onClick={onClearFilters}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Xóa tất cả bộ lọc
          </button>
        )}
      </div>
    );
  }

  // Task List
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-950 hover:shadow-md transition duration-200 gap-4"
        >
          {/* Thông tin Task */}
          <div className="space-y-1.5">
            <Link 
              to={`/task/${task.id}`} 
              className="font-bold text-gray-800 dark:text-gray-100 text-base hover:text-indigo-600 hover:underline transition"
            >
              {task.title}
            </Link>
            
            <div className="flex flex-wrap gap-2 items-center text-xs text-gray-600 dark:text-gray-200">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                task.status === 'done' || task.status === 'status 3' ? 'bg-emerald-50 text-emerald-700' :
                task.status === 'in-progress' || task.status === 'status 2' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {task.status}
              </span>
              {/* Chuẩn hóa tasks.priority */}
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                task.priority === 'high' ? 'bg-red-50 text-red-600' :
                task.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <AlertTriangle className="h-3 w-3" /> 
                {/* Nếu priority không phải low/medium/high (ví dụ là "13", "14" hoặc null), hiển thị mặc định là "low" */}
                {['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'low'}
              </span>
              
              {task.dueDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> 
                  {new Date(Number(task.dueDate)).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
          </div>

          {/* Hành động (Sửa & Xóa) */}
          <div className="flex items-center gap-1 self-end sm:self-center">
            <Link 
              to={`/tasks/${task.id}/edit`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              title="Chỉnh sửa công việc"
            >
              <Edit3 className="w-4 h-4" /> Sửa
            </Link>
            <button
              onClick={() => onDeleteTask(task)} // Gọi hàm truyền từ Dashboard và chuyển data của task vào
              className="p-1.5 text-gray-600 dark:text-gray-200 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
              title="Xóa công việc"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}