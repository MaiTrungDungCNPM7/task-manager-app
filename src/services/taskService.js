import axios from 'axios';

// Base URL từ mockAPI.io
const BASE_URL = 'https://6a4caa14e1cf82a4a17d5f1b.mockapi.io/api/v1'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Lấy toàn bộ danh sách công việc
  getAllTasks: () => api.get('/tasks'),
  
  // Lấy chi tiết 1 công việc
  getTaskById: (id) => api.get(`/tasks/${id}`),
  
  // Tạo mới một công việc (data sẽ là object gồm title, description, status)
  createTask: (taskData) => api.post('/tasks', taskData),
  
  // Cập nhật trạng thái hoặc nội dung công việc
  updateTask: (id, updatedData) => api.put(`/tasks/${id}`, updatedData),
  
  // Xóa công việc
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};