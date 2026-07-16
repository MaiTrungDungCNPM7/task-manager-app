import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import About from './pages/About.jsx'
import TaskDetail from './pages/TaskDetail.jsx'
import TaskFormPage from './pages/TaskFormPage.jsx'
import NotFound from './pages/NotFound.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App đóng vai trò là Layout tổng có chứa Navbar và Outlet */}
        <Route path="/" element={<App />}>
          {/* Tự động redirect từ "/" sang "/tasks" để dashboard nằm ở "/tasks" */}
          <Route index element={<Navigate to="/tasks" replace />} />
          <Route path="tasks" element={<Dashboard />} />
          {/* Route cho việc tạo mới và sửa đổi Task */}
          <Route path="tasks/new" element={<TaskFormPage />} />
          <Route path="tasks/:id/edit" element={<TaskFormPage />} />

          <Route path="about" element={<About />} />
          <Route path="task/:id" element={<TaskDetail />} /> {/* Thêm route động :id để đưa người dùng tới trang chi tiết */}

          <Route path="*" element={<NotFound />} /> {/* Nếu đường dẫn không tồn tại thì trả về trang 404 */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)