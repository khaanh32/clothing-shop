package com.nhasach.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sach")
@Data // Tự động tạo getter/setter từ thư viện Lombok
public class Sach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_sach")
    private String tenSach;

    @Column(name = "tac_gia")
    private String tacGia;

    @Column(name = "nha_xuat_ban")
    private String nhaXuatBan;

    @Column(name = "gia") // Đảm bảo cái name này khớp y hệt tên cột trong MySQL
    private Double gia;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "trong_luong")
    private Integer trongLuong;

    @Column(name = "kich_thuoc")
    private String kichThuoc;

    @Column(name = "so_trang")
    private Integer soTrang;

    @Column(columnDefinition = "TEXT")
    private String moTa;

    @Column(columnDefinition = "TEXT")
    private String anhBia;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @ManyToOne
    @JoinColumn(name = "loai_sach_id") // Tên cột khóa ngoại trong DB
    private LoaiSach loaiSach;

    @Column(name = "ngay_tao", updatable = false)
    private LocalDateTime ngayTao;

    @PrePersist
    protected void onCreate() {
        this.ngayTao = LocalDateTime.now();
    }

}