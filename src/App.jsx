import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layers, CheckCircle2, AlertCircle, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function App() {
  const location = useLocation();

  // State quản lý Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // State quản lý việc đóng/mở Mobile Menu (Responsive)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dark mode logic
  // Đọc theme ban đầu từ localStorage hoặc hệ thống của người dùng
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Đồng bộ hóa class 'dark' vào thẻ HTML khi state theme thay đổi
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Khai báo và tạo hàm xử lý toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type });
    }, 3000); // Tự tắt sau 3 giây
  };

  // Hàm helper dùng toán tử ba ngôi để kiểm tra xem route nào đang active để đổi màu chữ trên Navbar
  const isActive = (path) => location.pathname === path 
  ? 'text-indigo-600 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950 font-bold' 
  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      {/* Navbar cố định */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Task<span className="text-indigo-600 dark:text-indigo-400">Flow</span></span>
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

          {/* Nút chuyển đổi Theme (Cả Desktop & Mobile dùng chung ) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Chuyển chế độ Sáng/Tối"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Menu button: Chỉ hiển thị trên mobile (`flex md:hidden`) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Mỗi khi click vào thì đổi trạng thái isMenuOpen ngược lại
              type="button"
              className="p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 transition focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />} {/* Dấu X khi đang mở, icon Menu khi đang đóng */}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu: Chỉ xuất hiện dưới thanh navbar khi isMenuOpen = true */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1.5 shadow-inner animate-fade-in">
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