import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layers, CheckCircle2, AlertCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const location = useLocation();

  // State quản lý Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // State quản lý việc đóng/mở Mobile Menu (Responsive)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Khai báo và tạo hàm xử lý toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type });
    }, 3000); // Tự tắt sau 3 giây
  };

  // Hàm helper kiểm tra xem route nào đang active để đổi màu chữ trên Navbar
  const isActive = (path) => location.pathname === path ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar cố định */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">Task<span className="text-indigo-600">Flow</span></span>
          </div>

          {/* Desktop Navigation: Thêm `hidden md:flex` để ẩn trên mobile, chỉ hiện từ màn hình md trở lên */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/tasks" className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isActive('/tasks')}`}>
              Dashboard
            </Link>
            <Link to="/about" className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isActive('/about')}`}>
              Giới thiệu
            </Link>
          </div>

          {/* Menu button: Chỉ hiển thị trên mobile (`flex md:hidden`) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Mỗi khi click vào thì đổi trạng thái isMenuOpen ngược lại
              type="button"
              className="p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />} {/* Dấu X khi đang mở, icon Menu khi đang đóng */}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu: Chỉ xuất hiện dưới thanh navbar khi isMenuOpen = true */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1.5 shadow-inner animate-fade-in">
            <Link 
              to="/tasks" 
              onClick={() => setIsMenuOpen(false)} // Tự động đóng menu sau khi click chuyển trang
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${isActive('/tasks')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)} // Tự động đóng menu sau khi click chuyển trang
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${isActive('/about')}`}
            >
              Giới thiệu
            </Link>
          </div>
        )}
      </nav>

      {/* Truyền hàm showToast qua context của Outlet như một props để các trang con render bên trong outlet đều dùng được */}
      <main className="max-w-7xl mx-auto p-6 mt-4">
        <Outlet context={{ showToast }} />
      </main>

      {/* Toast container */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border animate-bounce-short bg-white text-gray-800 border-gray-100">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}