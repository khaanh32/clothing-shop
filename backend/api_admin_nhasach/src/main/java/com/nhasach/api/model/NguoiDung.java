package com.nhasach.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "nguoidung")
@Data
public class NguoiDung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_dang_nhap", unique = true)
    private String tenDangNhap;

    @Column(name = "mat_khau")
    private String matKhau;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(columnDefinition = "TEXT")
    private String diaChi;

    private String provider; // 'local', 'google'

    private String role; // 'admin', 'khach_hang'

    @Column(name = "ngay_tao", insertable = false, updatable = false)
    private LocalDateTime ngayTao;
}