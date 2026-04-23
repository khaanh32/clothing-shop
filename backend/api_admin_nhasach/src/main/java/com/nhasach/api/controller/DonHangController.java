package com.nhasach.api.controller;

import com.nhasach.api.model.DonHang;
import com.nhasach.api.service.DonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/don-hang")
public class DonHangController {

    @Autowired
    private DonHangService donHangService;

    // 1. Lấy tất cả đơn hàng: GET /api/don-hang
    @GetMapping
    public List<DonHang> getAll() {
        return donHangService.getAllDonHang();
    }

    // 2. Xem chi tiết đơn hàng: GET /api/don-hang/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DonHang> getById(@PathVariable Integer id) {
        return donHangService.getDonHangById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Xem đơn hàng của tôi: GET /api/don-hang/user/{userId}
    @GetMapping("/user/{userId}")
    public List<DonHang> getByUserId(@PathVariable Integer userId) {
        return donHangService.getDonHangByNguoiDung(userId);
    }
}  