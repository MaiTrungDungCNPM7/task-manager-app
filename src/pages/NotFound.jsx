import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound({ message }) {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <div className="bg-red-50 text-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 dark:text-gray-200 mb-2">404 - Không tìm thấy</h1>
      <p className="text-gray-600 dark:text-gray-200 text-sm mb-8 leading-relaxed">
        {message || "Đường dẫn bạn truy cập không tồn tại hoặc dữ liệu công việc đã bị xóa khỏi hệ thống."}
      </p>
      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Trang chủ
      </Link>
    </div>
  );
}