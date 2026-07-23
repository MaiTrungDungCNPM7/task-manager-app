import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Mỗi khi 'value' thay đổi thì hẹn giờ sau 'delay' ms mới gán lại giá trị cho 'debounced'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hàm dọn rác xóa timeout cũ nếu 'value' thay đổi khi timer chưa chạy xong
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}