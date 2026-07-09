import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import About from './pages/About.jsx'
import TaskDetail from './pages/TaskDetail.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App đóng vai trò là Layout tổng có chứa Navbar và Outlet */}
        <Route path="/" element={<App />}>
          {/* index có nghĩa đây là trang mặc định hiển thị tại vị trí Outlet khi vào đường dẫn gốc / */}
          <Route index element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="task/:id" element={<TaskDetail />} /> {/* Thêm route động :id để đưa người dùng tới trang chi tiết */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)