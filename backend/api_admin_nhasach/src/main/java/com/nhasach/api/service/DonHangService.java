package com.nhasach.api.service;

import com.nhasach.api.model.DonHang;
import com.nhasach.api.repository.DonHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DonHangService {
    @Autowired
    private DonHangRepository donHangRepository;

    // Lấy tất cả đơn hàng (cho Admin)
    public List<DonHang> getAllDonHang() {
        return donHangRepository.findAll();
    }

    // Xem chi tiết một đơn hàng theo ID
    public Optional<DonHang> getDonHangById(Integer id) {
        return donHangRepository.findById(id);
    }

    // Xem danh sách đơn hàng của một người dùng cụ thể
    public List<DonHang> getDonHangByNguoiDung(Integer nguoiDungId) {
        return donHangRepository.findByNguoiDungId(nguoiDungId);
    }
}