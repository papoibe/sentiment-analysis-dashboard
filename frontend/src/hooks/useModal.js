import { useState, useCallback } from 'react';

// useModal — Hook quản lý trạng thái modal dùng chung
// Thay vì khai báo [modalOpen, setModalOpen] + [modalData, setModalData] ở mỗi page
// Params:
//   (không có)
// Returns:
//   isOpen: boolean — modal đang mở hay không
//   data: any — dữ liệu truyền vào modal (VD: review cần flag, user cần xóa)
//   open(data): mở modal với dữ liệu
//   close(): đóng modal và xóa dữ liệu
//   toggle(): đảo trạng thái mở/đóng
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  // Mở modal với dữ liệu tùy chọn
  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  // Đóng modal và xóa dữ liệu
  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  // Toggle trạng thái
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, data, open, close, toggle };
};

export default useModal;
