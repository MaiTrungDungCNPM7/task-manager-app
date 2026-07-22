import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import About from './pages/About.jsx'
import TaskDetail from './pages/TaskDetail.jsx'
import TaskFormPage from './pages/TaskFormPage.jsx'
import NotFound from './pages/NotFound.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AppProvider } from './context/AppContext.jsx' // Import Provider
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* App đóng vai trò là Layout tổng có chứa Navbar và Outlet */}
          <Route path="/" element={<App />}>
            {/* Tự động redirect từ "/" sang "/tasks" để dashboard nằm ở "/tasks" */}
            <Route index element={<Navigate to="/tasks" replace />} />
            {/* Route công khai */}
            <Route path="login" element={<LoginPage />} />
            <Route path="about" element={<About />} />
            {/* Các route dưới đây yêu cầu phải ĐĂNG NHẬP mới được vào */}
            <Route
              path="tasks"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="tasks/new"
              element={
                <ProtectedRoute>
                  <TaskFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tasks/:id/edit"
              element={
                <ProtectedRoute>
                  <TaskFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="task/:id"
              element={
                <ProtectedRoute>
                  <TaskDetail />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} /> {/* Nếu đường dẫn không tồn tại thì trả về trang 404 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
)