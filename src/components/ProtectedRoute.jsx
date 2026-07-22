import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    // Lưu lại vị trí trang đang cố truy cập trong location.state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}