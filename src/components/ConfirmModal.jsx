import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-scale-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa?</h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Bạn có chắc chắn muốn xóa vĩnh viễn công việc <strong className="text-gray-800">"{title}"</strong> không? Hành động này không thể hoàn tác.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm transition"
          >
            Đồng ý xóa
          </button>
        </div>
      </div>
    </div>
  );
}