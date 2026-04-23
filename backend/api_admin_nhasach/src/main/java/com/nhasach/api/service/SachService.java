package com.nhasach.api.service;

import com.nhasach.api.model.Sach;
import com.nhasach.api.repository.SachRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class SachService {
    @Autowired
    private SachRepository sachRepository;

    // 1. Lấy danh sách (Đã có)
    public Page<Sach> getListSachAdmin(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if (keyword != null && !keyword.trim().isEmpty()) {
            return sachRepository.findByTenSachContainingIgnoreCase(keyword, pageable);
        }
        return sachRepository.findAll(pageable);
    }

    // 2. Thêm mới hoặc Cập nhật sách
    public Sach saveOrUpdate(Sach sach) {
        return sachRepository.save(sach);
    }

    // 3. Xóa sách theo ID
    public void delete(Integer id) {
        if (!sachRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sách có ID: " + id);
        }
        sachRepository.deleteById(id);
    }

    // 4. Tìm 1 cuốn sách (Dùng để đổ dữ liệu vào Form Sửa)
    public Sach getById(Integer id) {
        return sachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách ID: " + id));
    }
}