package com.nhasach.api.service;

import com.nhasach.api.repository.SachRepository;
import com.nhasach.api.model.LoaiSach;
import com.nhasach.api.repository.LoaiSachRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LoaiSachService {
    @Autowired
    private LoaiSachRepository loaiSachRepository;

    @Autowired
    private SachRepository sachRepository; // Tiêm SachRepository để kiểm tra

    public List<LoaiSach> getAll() {
        return loaiSachRepository.findAll();
    }

    public LoaiSach save(LoaiSach loaiSach) {
        if(loaiSachRepository.existsByTenLoai(loaiSach.getTenLoai())) {
            throw new RuntimeException("Tên loại sách này đã tồn tại!");
        }
        return loaiSachRepository.save(loaiSach);
    }

    public LoaiSach update(Integer id, LoaiSach details) {
        LoaiSach loai = loaiSachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại sách ID: " + id));
        loai.setTenLoai(details.getTenLoai());
        return loaiSachRepository.save(loai);
    }

    public void delete(Integer id) {
        // BƯỚC KIỂM TRA QUAN TRỌNG:
        // Giả sử trong SachRepository bạn có phương thức countByLoaiSachId hoặc tương đương
        // Ở đây mình dùng cách đơn giản nhất là tìm kiếm xem có sách nào chứa ID này không
        boolean isUsed = sachRepository.findAll().stream()
                        .anyMatch(s -> s.getLoaiSach() != null && s.getLoaiSach().getId().equals(id));

        if (isUsed) {
            throw new RuntimeException("Không thể xóa! Loại sách này đang có sách thuộc về nó.");
        }

        loaiSachRepository.deleteById(id);
    }
}