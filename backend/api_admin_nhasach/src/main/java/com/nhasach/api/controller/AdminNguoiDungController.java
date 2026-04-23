package com.nhasach.api.controller;

import com.nhasach.api.model.NguoiDung;
import com.nhasach.api.service.NguoiDungService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin("*")
public class AdminNguoiDungController {

    @Autowired
    private NguoiDungService nguoiDungService;

    // LẤY DANH SÁCH
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String keyword,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(nguoiDungService.getListKhachHang(keyword, page, size));
    }

    // THÊM MỚI
    @PostMapping
    public ResponseEntity<?> create(@RequestBody NguoiDung user) {
        try {
            return ResponseEntity.ok(nguoiDungService.create(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // CẬP NHẬT
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody NguoiDung user) {
        try {
            return ResponseEntity.ok(nguoiDungService.update(id, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // XÓA
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            nguoiDungService.delete(id);
            return ResponseEntity.ok("Xóa thành công người dùng ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}