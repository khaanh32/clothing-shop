package com.nhasach.api.controller;

import com.nhasach.api.model.LoaiSach;
import com.nhasach.api.service.LoaiSachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/loai-sach")
@CrossOrigin("*")
public class LoaiSachController {

    @Autowired
    private LoaiSachService loaiSachService;

    @GetMapping
    public ResponseEntity<List<LoaiSach>> getAll() {
        return ResponseEntity.ok(loaiSachService.getAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody LoaiSach loaiSach) {
        try {
            return ResponseEntity.ok(loaiSachService.save(loaiSach));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody LoaiSach loaiSach) {
        try {
            return ResponseEntity.ok(loaiSachService.update(id, loaiSach));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            loaiSachService.delete(id);
            return ResponseEntity.ok("Xóa thành công loại sách!");
        } catch (Exception e) {
            // Trả về thông báo lỗi "Đang được sử dụng" cho Frontend
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}