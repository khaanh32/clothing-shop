package com.nhasach.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "loaisach")
@Data
public class LoaiSach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_loai", nullable = false, length = 255)
    private String tenLoai;
}