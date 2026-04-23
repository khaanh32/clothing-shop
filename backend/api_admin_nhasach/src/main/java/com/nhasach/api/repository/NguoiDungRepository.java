package com.nhasach.api.repository;

import com.nhasach.api.model.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Integer> {
    
    // Lấy danh sách người dùng theo Role (Phân trang)
    Page<NguoiDung> findByRole(String role, Pageable pageable);

    // Tìm kiếm khách hàng theo Tên hoặc Email (Phân trang)
    Page<NguoiDung> findByRoleAndTenDangNhapContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String role, String ten, String email, Pageable pageable
    );
    boolean existsByEmail(String email);
    
    boolean existsByTenDangNhap(String tenDangNhap);
}
