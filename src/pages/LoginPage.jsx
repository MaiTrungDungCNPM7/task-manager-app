import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { Layers, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Logic tránh xảy ra vòng lặp
  // Nếu from không có hoặc from chính là '/login' -> Ép về '/tasks'
  const rawFrom = location.state?.from?.pathname;
  const from = (rawFrom && rawFrom !== '/login') ? rawFrom : '/tasks';

  // Nếu đã đăng nhập (user tồn tại): Tự động thoát khỏi trang Login, đẩy về Dashboard
  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Vui lòng điền đầy đủ Email và Mật khẩu!');
      return;
    }

    try {
      setLoading(true);
      const { user, token } = await authService.login(email, password);
      login(user, token);
      showToast(`Chào mừng ${user.name} đã quay trở lại!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-8 space-y-6 animate-scale-up">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-indigo-600 text-white p-3 rounded-2xl shadow-md mb-2">
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Đăng nhập vào <span className="text-indigo-600 dark:text-indigo-400">TaskFlow</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Nhập email và mật khẩu của bạn để tiếp tục
          </p>
        </div>

        {/* Thông báo Lỗi */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white transition"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Gợi ý: Nhập email bất kỳ có dấu @ và mật khẩu &ge; 6 ký tự</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200 dark:shadow-none"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}