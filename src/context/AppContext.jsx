import { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { authService } from '../services/authService';

// Khởi tạo Context
const AppContext = createContext(null);

// useReducer của Authentication
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

// Provider Component
export function AppProvider({ children }) {
  // Toast State & Logic
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type });
    }, 3000);
  };

  // Dark Mode State & Logic 
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

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

  // Authentication State
  const [authState, dispatch] = useReducer(authReducer, { user: null });

  // Tự động kiểm tra Token khi load app, chạy một lần duy nhất khi khởi tạo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = authService.getUser(token);
      if (user && user.exp > Date.now()) {
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Hàm xử lý logic cho login và logout
  const login = (userData, token) => {
    localStorage.setItem('token', token); // Lưu thông tin đăng nhập, token vào local storage
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('token'); // Xóa ra khỏi local storage khi logout
    dispatch({ type: 'LOGOUT' });
    showToast('Đã đăng xuất thành công!');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        toast,
        showToast,
        user: authState.user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook giúp truy cập nhanh từ bất kỳ đâu
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp phải được sử dụng bên trong AppProvider');
  }
  return context;
};