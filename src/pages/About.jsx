export default function About() {
  return (
    <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Về Ứng Dụng Task Manager</h2>
      <p className="text-gray-600 leading-relaxed">
        Đây là một ứng dụng quản lý Task nhỏ được xây dựng dựa trên nền tảng React, kết hợp thư viện Tailwind CSS thiết kế giao diện, sử dụng React Router để phân trang, và kết nối đồng bộ trực tiếp với MockAPI thông qua Axios.
      </p>
    </div>
  );
}