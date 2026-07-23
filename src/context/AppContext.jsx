import { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { authService } from '../services/authService';

const AppContext = createContext(null);

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

// Thêm hàm khởi tạo đồng bộ 
const getInitialUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const user = authService.getUser(token);
    // Nếu token có tồn tại và còn hạn, trả về user ngay lập tức
    if (user && user.exp > Date.now()) {
      return user;
    }
    // Nếu hết hạn thì dọn dẹp rác
    localStorage.removeItem('token');
  }
  return null;
};

// Logic của Toast và theme
export function AppProvider({ children }) {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

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

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Gọi hàm getInitialUser() để cấp giá trị mặc định chuẩn xác 
  const [authState, dispatch] = useReducer(authReducer, { user: getInitialUser() });

  const login = (userData, token) => {
    localStorage.setItem('token', token); 
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('token'); 
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

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp phải được sử dụng bên trong AppProvider');
  return context;
};