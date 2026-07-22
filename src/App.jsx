import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layers, CheckCircle2, AlertCircle, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useApp } from './context/AppContext'; // Import Custom Hook

export default function App() {
  const location = useLocation();

  // State quản lý việc đóng/mở Mobile Menu (Responsive)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lấy dữ liệu & hàm trực tiếp từ Context thay thế cho khai báo Effect toast và theme cồng kềnh như trước
  const { theme, toggleTheme, toast } = useApp();
  // Lấy context cho login & logout
  const { user, logout } = useApp();

  // Hàm helper dùng toán tử ba ngôi để kiểm tra xem route nào đang active để đổi màu chữ trên Navbar
  const isActive = (path) => location.pathname === path 
  ? 'text-indigo-600 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950 font-bold' 
  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Task<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          </div>

          {/* Navigation bar */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/tasks" className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isActive('/tasks')}`}>
              Dashboard
            </Link>
            <Link to="/about" className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isActive('/about')}`}>
              Giới thiệu
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="Chuyển chế độ Sáng/Tối"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 transition focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Hiển thị User & Logout nếu đã đăng nhập */}
            {user && (
              <div className="flex items-center gap-3 border-l pl-3 border-gray-200 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 hidden sm:inline">
                  Xin chào, <span className="text-indigo-600 dark:text-indigo-400">{user.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center gap-1 text-xs font-bold"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Menu button */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1.5 shadow-inner">
            <Link 
              to="/tasks" 
              onClick={() => setIsMenuOpen(false)} 
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${isActive('/tasks')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)} 
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${isActive('/about')}`}
            >
              Giới thiệu
            </Link>
          </div>
        )}
      </nav>

      {/* Loại bỏ Outlet Context props */}
      <main className="max-w-7xl mx-auto p-6 mt-4">
        <Outlet />
      </main>

      {/* Toast container */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border animate-bounce-short bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-100 dark:border-gray-700">
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