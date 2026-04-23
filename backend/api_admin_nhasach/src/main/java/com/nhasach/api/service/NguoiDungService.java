package com.nhasach.api.service;

import com.nhasach.api.model.NguoiDung;
import com.nhasach.api.repository.NguoiDungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

@Service
public class NguoiDungService {
    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    // 1. Lấy danh sách khách hàng (Đã có)
    public Page<NguoiDung> getListKhachHang(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        String role = "khach_hang";
        if (keyword != null && !keyword.trim().isEmpty()) {
            return nguoiDungRepository.findByRoleAndTenDangNhapContainingIgnoreCaseOrEmailContainingIgnoreCase(
                role, keyword, keyword, pageable
            );
        }
        return nguoiDungRepository.findByRole(role, pageable);
    }
    
    // 2. Thêm mới người dùng
    public NguoiDung create(NguoiDung user) {
        if (nguoiDungRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        if (user.getTenDangNhap() != null && nguoiDungRepository.existsByTenDangNhap(user.getTenDangNhap())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        return nguoiDungRepository.save(user);
    }

    // 3. Cập nhật thông tin
    public NguoiDung update(Integer id, NguoiDung userDetails) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng ID: " + id));
        
        user.setTenDangNhap(userDetails.getTenDangNhap());
        user.setEmail(userDetails.getEmail());
        user.setSoDienThoai(userDetails.getSoDienThoai());
        user.setDiaChi(userDetails.getDiaChi());
        user.setRole(userDetails.getRole());
        user.setMatKhau(userDetails.getMatKhau()); // Lưu ý: thực tế cần mã hóa mật khẩu
        
        return nguoiDungRepository.save(user);
    }

    // 4. Xóa người dùng
    public void delete(Integer id) {
        if (!nguoiDungRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy người dùng ID: " + id);
        }
        nguoiDungRepository.deleteById(id);
    }
}