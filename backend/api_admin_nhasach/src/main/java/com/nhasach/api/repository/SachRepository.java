package com.nhasach.api.repository;

import com.nhasach.api.model.Sach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SachRepository extends JpaRepository<Sach, Integer> {
    // Tìm theo tên chứa từ khóa (LIKE %search%)
    Page<Sach> findByTenSachContainingIgnoreCase(String tenSach, Pageable pageable);
}