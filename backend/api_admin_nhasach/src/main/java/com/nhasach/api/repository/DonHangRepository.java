package com.nhasach.api.repository;

import com.nhasach.api.model.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Integer> {
    // Tìm danh sách đơn hàng theo ID người dùng
    List<DonHang> findByNguoiDungId(Integer nguoiDungId);
}