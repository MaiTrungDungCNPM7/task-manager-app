import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layers, Info } from 'lucide-react';

export default function App() {
  const location = useLocation();

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

          <div className="flex items-center gap-2">
            <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isActive('/')}`}>
              Dashboard
            </Link>
            <Link to="/about" className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isActive('/about')}`}>
              Giới thiệu
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard & About */}
      <main className="max-w-7xl mx-auto p-6 mt-4">
        <Outlet />
      </main>
    </div>
  );
}