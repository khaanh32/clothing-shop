package com.nhasach.api.repository;

import com.nhasach.api.model.LoaiSach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoaiSachRepository extends JpaRepository<LoaiSach, Integer> {
    // Tìm kiếm loại sách theo tên nếu cần
    java.util.List<LoaiSach> findByTenLoaiContainingIgnoreCase(String tenLoai);
    // Kiểm tra xem tên loại đã tồn tại chưa (dùng cho thêm/sửa)
    boolean existsByTenLoai(String tenLoai);
    // Hàm này giúp kiểm tra nhanh xem có cuốn sách nào thuộc loại này không
    
}