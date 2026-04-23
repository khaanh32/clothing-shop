package com.nhasach.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donhang")
@Data
public class DonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nguoi_dung_id")
    private Integer nguoiDungId;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "thanh_tien")
    private BigDecimal thanhTien;

    @Column(name = "tong_tien")
    private BigDecimal tongTien;

    @Column(name = "so_tien_giam")
    private BigDecimal soTienGiam;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "ten_nguoi_nhan")
    private String tenNguoiNhan;

    @Column(name = "sdt_nguoi_nhan")
    private String sdtNguoiNhan;

    @Column(name = "dia_chi_giao_hang")
    private String diaChiGiaoHang;

    @Column(name = "so_luong_sach")
    private Integer soLuongSach;

    @Column(name = "phuong_thuc_thanh_toan")
    private String phuongThucThanhToan;
}