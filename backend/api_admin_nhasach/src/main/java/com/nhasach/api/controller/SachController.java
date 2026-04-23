package com.nhasach.api.controller;

import com.nhasach.api.model.Sach;
import com.nhasach.api.service.SachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/sach")
@CrossOrigin("*")
public class SachController {

    @Autowired
    private SachService sachService;

    // HIỂN THỊ DANH SÁCH
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String search,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(sachService.getListSachAdmin(search, page, size));
    }

    // LẤY CHI TIẾT 1 CUỐN (Để hiện lên Form sửa)
    @GetMapping("/{id}")
    public ResponseEntity<Sach> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(sachService.getById(id));
    }

    // THÊM MỚI SÁCH
    @PostMapping
    public ResponseEntity<Sach> create(@RequestBody Sach sach) {
        // Hibernate sẽ tự hiểu nếu id = null là thêm mới
        return ResponseEntity.ok(sachService.saveOrUpdate(sach));
    }

    // CẬP NHẬT SÁCH
    @PutMapping("/{id}")
    public ResponseEntity<Sach> update(@PathVariable Integer id, @RequestBody Sach sach) {
        sach.setId(id); // Đảm bảo ID được giữ nguyên khi cập nhật
        return ResponseEntity.ok(sachService.saveOrUpdate(sach));
    }

    // XÓA SÁCH
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        sachService.delete(id);
        return ResponseEntity.ok("Xóa thành công sách ID: " + id);
    }
}