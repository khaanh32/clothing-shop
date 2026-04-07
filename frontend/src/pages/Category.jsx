import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../axiosClient';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Search, X, SlidersHorizontal, AlertCircle, RefreshCw, BookOpen,
} from 'lucide-react';

const Pagination = ({ current, total, onPage }) => {
  if (total <= 1) return null;
  const pages = [];
  const range = 2;
  for (let i = 1; i <= total; i++) {
    if (i <= range || i > total - range || Math.abs(i - current) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }
  return (
    <div className="cat-pagination">
      <button className="cat-page-btn" onClick={() => onPage(current - 1)} disabled={current === 1}>
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`dot-${i}`} className="cat-page-dots">…</span>
        ) : (
          <button
            key={p}
            className={`cat-page-btn ${current === p ? 'active' : ''}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        )
      )}
      <button className="cat-page-btn" onClick={() => onPage(current + 1)} disabled={current === total}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const NXB_LIST = ['NXB Trẻ', 'NXB Kim Đồng', 'Nhã Nam', 'NXB Hội Nhà Văn', 'NXB Phụ Nữ', 'NXB Giáo Dục'];

const FilterPanel = ({ hasActiveFilter, clearFilters, filters, categories, handleFilter }) => (
  <div className="cat-filter-content">
    <div className="cat-filter-header-inline">
      <span className="cat-group-label" style={{ marginBottom: 0 }}>Tùy chọn lọc</span>
      {hasActiveFilter && (
        <button className="cat-clear-btn" onClick={clearFilters}>Xóa sạch</button>
      )}
    </div>

    {/* Thay radio bằng danh sách Nút bấm (Chips) cho Thể loại */}
    <div className="cat-filter-group">
      <p className="cat-group-label">Thể loại sách</p>
      <div className="cat-chip-list">
        {categories.map(cat => {
          const isActive = filters.loai_sach_id == cat.id;
          return (
            <button
              key={cat.id}
              className={`cat-chip-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleFilter('loai_sach_id', isActive ? '' : cat.id)}
            >
              {cat.ten_loai}
            </button>
          );
        })}
      </div>
    </div>

    {/* Thay ô Input Test bằng danh sách Nút bấm cho NXB */}
    <div className="cat-filter-group">
      <p className="cat-group-label">Nhà xuất bản phổ biến</p>
      <div className="cat-chip-list">
        {NXB_LIST.map(nxb => {
          const isActive = filters.nha_xuat_ban === nxb;
          return (
            <button
              key={nxb}
              className={`cat-chip-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleFilter('nha_xuat_ban', isActive ? '' : nxb)}
            >
              {nxb}
            </button>
          );
        })}
      </div>
    </div>

    {/* Khoảng giá */}
    <div className="cat-filter-group">
      <p className="cat-group-label">Khoảng giá (VNĐ)</p>
      <div className="cat-price-row">
        <input
          type="number"
          placeholder="Tối thiểu"
          value={filters.gia_min}
          onChange={e => handleFilter('gia_min', e.target.value)}
          className="cat-price-input"
        />
        <span className="cat-price-sep">-</span>
        <input
          type="number"
          placeholder="Tối đa"
          value={filters.gia_max}
          onChange={e => handleFilter('gia_max', e.target.value)}
          className="cat-price-input"
        />
      </div>
    </div>
  </div>
);

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalItems, setTotalItems]   = useState(0);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [showSort, setShowSort]       = useState(false);

  const [filters, setFilters] = useState({
    loai_sach_id: searchParams.get('loai_sach_id') || '',
    nha_xuat_ban: searchParams.get('nha_xuat_ban') || '',
    gia_min: '',
    gia_max: '',
    sort_by: 'moi_nhat',
  });

  const sortRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    axiosClient.get('/loaisach')
      .then(r => setCategories(r.data?.data || []))
      .catch(() => {});
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = { page: currentPage, ...filters };
      const r = await axiosClient.get('/sach/filter', { params });
      const pg = r.data.data;
      setBooks(pg.data || []);
      setTotalPages(pg.last_page || 1);
      setTotalItems(pg.total || 0);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    const id = setTimeout(fetchBooks, 400);
    return () => clearTimeout(id);
  }, [fetchBooks]);

  const handleFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ loai_sach_id: '', nha_xuat_ban: '', gia_min: '', gia_max: '', sort_by: 'moi_nhat' });
    setCurrentPage(1);
  };

  const sortLabel = { moi_nhat: 'Mới nhất', gia_tang: 'Giá tăng dần', gia_giam: 'Giá giảm dần' };

  const hasActiveFilter =
    filters.loai_sach_id !== '' ||
    filters.nha_xuat_ban !== '' ||
    filters.gia_min !== '' ||
    filters.gia_max !== '';

  return (
    <div className="cat-page-root">
      {/* Drawer Overlay (Black/50) */}
      {drawerOpen && <div className="cat-drawer-overlay" onClick={() => setDrawerOpen(false)} />}
      
      {/* Off-canvas Drawer */}
      <div className={`cat-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="cat-drawer-header">
          <div className="drawer-title-wrapper">
            <SlidersHorizontal size={20} className="drawer-title-icon" />
            <h4 className="drawer-title">Bộ lọc sản phẩm</h4>
          </div>
          <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)}><X size={24} /></button>
        </div>
        
        <div className="cat-drawer-body">
          <FilterPanel hasActiveFilter={hasActiveFilter} clearFilters={clearFilters} filters={filters} categories={categories} handleFilter={handleFilter} />
        </div>

        <div className="cat-drawer-footer">
          <button className="cat-apply-btn" onClick={() => setDrawerOpen(false)}>
            Xem {totalItems} kết quả
          </button>
        </div>
      </div>

      <div className="cat-layout-wrapper">
        {/* Breadcrumb & Title */}
        <div className="cat-top-header">
          <div className="cat-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="cat-mx">/</span>
            <span className="cat-active">Cửa hàng</span>
          </div>
          <h1 className="cat-main-title">Danh mục sản phẩm</h1>
        </div>

        {/* Cột Phải -> Full Width Now */}
        <main className="cat-main-fullwidth">
          {/* Toolbar */}
          <div className="cat-toolbar">
            <div className="cat-toolbar-left">
              <button className="cat-filter-trigger" onClick={() => setDrawerOpen(true)}>
                <div className="icon-wrap">
                  <SlidersHorizontal strokeWidth={1.5} size={18} />
                  {hasActiveFilter && <div className="active-dot"/>}
                </div>
                <span>Bộ lọc</span>
              </button>
              <div className="cat-result-text">
                Hiển thị <span className="cat-font-bold">{totalItems}</span> sản phẩm
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="cat-sort-wrapper" ref={sortRef}>
              <div className="cat-sort-label">Sắp xếp theo:</div>
              <button className="cat-sort-trigger" onClick={() => setShowSort(p => !p)}>
                {sortLabel[filters.sort_by]}
                <ChevronDown size={16} className={showSort ? 'rotate' : ''}/>
              </button>
              {showSort && (
                <div className="cat-sort-dropdown">
                  {Object.entries(sortLabel).map(([val, label]) => (
                    <button
                      key={val}
                      className={`cat-sort-item ${filters.sort_by === val ? 'active' : ''}`}
                      onClick={() => { handleFilter('sort_by', val); setShowSort(false); }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags (if any filter is active) */}
          {hasActiveFilter && (
            <div className="cat-tags-row">
              {filters.loai_sach_id && categories.find(c => c.id == filters.loai_sach_id) && (
                <span className="cat-tag">
                  {categories.find(c => c.id == filters.loai_sach_id).ten_loai}
                  <button onClick={() => handleFilter('loai_sach_id', '')}><X size={14} /></button>
                </span>
              )}
              {filters.nha_xuat_ban && (
                <span className="cat-tag">
                  NXB: {filters.nha_xuat_ban}
                  <button onClick={() => handleFilter('nha_xuat_ban', '')}><X size={14} /></button>
                </span>
              )}
              {(filters.gia_min || filters.gia_max) && (
                <span className="cat-tag">
                  Giá: {filters.gia_min || '0'}đ - {filters.gia_max || '∞'}đ
                  <button onClick={() => { handleFilter('gia_min', ''); handleFilter('gia_max', ''); }}><X size={14} /></button>
                </span>
              )}
              <button className="cat-clear-all-tags" onClick={clearFilters}>Xóa tất cả</button>
            </div>
          )}

          {/* Products Grid (Full-width 4 cols) */}
          {error ? (
            <div className="cat-error-box ds-card">
              <AlertCircle size={48} strokeWidth={1.5} className="cat-icon-err" />
              <h3 className="error-title">Không thể tải dữ liệu</h3>
              <p className="error-desc">Có lỗi xảy ra trong quá trình lấy thông tin từ máy chủ. Vui lòng thử lại sau.</p>
              <button onClick={fetchBooks} className="cat-retry-btn"><RefreshCw size={16} className="btn-icon"/> Thử lại</button>
            </div>
          ) : (
            <div className="cat-product-grid">
              {loading
                ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
                : books.length > 0
                  ? books.map(book => <ProductCard key={book.id} sach={book} />)
                  : (
                    <div className="cat-empty-box ds-card">
                      <BookOpen size={56} strokeWidth={1} className="cat-empty-icon" />
                      <h3 className="empty-title">Không tìm thấy sản phẩm nào</h3>
                      <p className="empty-desc">Rất tiếc, bộ sưu tập hiện tại chưa có sách khớp với tiêu chí của bạn.</p>
                      <button className="cat-clear-btn-large" onClick={clearFilters}>Xóa bộ lọc</button>
                    </div>
                  )
              }
            </div>
          )}

          {/* Pagination Component */}
           {!loading && !error && (
            <Pagination
              current={currentPage}
              total={totalPages}
              onPage={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          )}

        </main>
      </div>

      <style>{`
        /* -------------------------------------------------------------
           GLOBAL & LAYOUT
           ------------------------------------------------------------- */
        .cat-page-root {
          background-color: #f8fafc; /* bg-slate-50 */
          min-height: 100vh;
          padding-top: 2rem;
          padding-bottom: 5rem;
          font-family: inherit;
        }
        .cat-layout-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Helpers */
        .ds-card {
          background-color: #ffffff;
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* shadow-sm */
          border: 1px solid #f1f5f9;
        }

        /* -------------------------------------------------------------
           HEADER AREA
           ------------------------------------------------------------- */
        .cat-top-header { 
          margin-bottom: 2rem; 
        }
        .cat-breadcrumb {
          font-size: 0.875rem;
          color: #64748b;
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .cat-breadcrumb a { color: #64748b; text-decoration: none; transition: color 0.2s; }
        .cat-breadcrumb a:hover { color: #1e3a5f; }
        .cat-mx { margin: 0 0.5rem; color: #cbd5e1; }
        .cat-breadcrumb .cat-active { color: #1e3a5f; font-weight: 500; }
        
        .cat-main-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1e3a5f;
          letter-spacing: -0.02em;
        }

        /* -------------------------------------------------------------
           MAIN FULL WIDTH
           ------------------------------------------------------------- */
        .cat-main-fullwidth {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* -------------------------------------------------------------
           TOOLBAR
           ------------------------------------------------------------- */
        .cat-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }
        
        .cat-toolbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        /* Filter Trigger Button (Navy Blue Outline) */
        .cat-filter-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background-color: #ffffff;
          border: 1.5px solid #1e3a5f; /* Navy border */
          border-radius: 99px; /* Pill shape for modern look */
          color: #1e3a5f;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cat-filter-trigger:hover {
          background-color: #f8fafc;
        }
        .cat-filter-trigger .icon-wrap {
          position: relative;
          display: flex;
        }
        .cat-filter-trigger .active-dot {
          position: absolute;
          top: -2px; right: -2px;
          width: 8px; height: 8px;
          background-color: #ef4444; /* Red dot for active filter */
          border-radius: 50%;
          border: 1.5px solid #ffffff;
        }

        .cat-result-text {
          font-size: 0.95rem;
          color: #64748b;
        }
        .cat-font-bold { font-weight: 700; color: #1e3a5f; }
        
        /* Sort Dropdown */
        .cat-sort-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: relative;
        }
        .cat-sort-label {
          font-size: 0.95rem;
          color: #64748b;
        }
        .cat-sort-trigger {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.625rem 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e3a5f;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .cat-sort-trigger:hover { border-color: #cbd5e1; }
        .cat-sort-trigger .rotate { transform: rotate(180deg); transition: transform 0.2s; }
        
        .cat-sort-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: #ffffff;
          width: 200px;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
          padding: 0.5rem;
          z-index: 50;
        }
        .cat-sort-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .cat-sort-item:hover, .cat-sort-item.active {
          background-color: #f8fafc;
          color: #1e3a5f;
          font-weight: 600;
        }

        /* -------------------------------------------------------------
           ACTIVE TAGS (CHIPS)
           ------------------------------------------------------------- */
        .cat-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: -0.5rem;
          align-items: center;
        }
        .cat-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #ffffff;
          color: #1e3a5f;
          padding: 0.35rem 0.875rem;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .cat-tag button {
          background-color: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 50%;
          width: 20px; height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cat-tag button:hover {
          background-color: #e2e8f0;
          color: #0f172a;
        }
        .cat-clear-all-tags {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          margin-left: 0.5rem;
        }
        .cat-clear-all-tags:hover { text-decoration: underline; }

        /* -------------------------------------------------------------
           PRODUCT GRID (FULL WIDTH)
           ------------------------------------------------------------- */
        .cat-product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* 4 items per row on laptop by default */
          gap: 1.5rem;
        }
        
        @media (min-width: 1400px) {
           .cat-product-grid { grid-template-columns: repeat(5, 1fr); }
        }

        /* Errors and Empties */
        .cat-error-box, .cat-empty-box {
          padding: 5rem 2rem;
          text-align: center;
          width: 100%;
        }
        .error-title, .empty-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e3a5f;
          margin-bottom: 0.5rem;
        }
        .error-desc, .empty-desc {
          color: #64748b;
          font-size: 1rem;
        }
        .cat-icon-err { color: #ef4444; margin: 0 auto 1.25rem; }
        .cat-empty-icon { color: #cbd5e1; margin: 0 auto 1.5rem; }
        .cat-retry-btn, .cat-clear-btn-large {
          background-color: #1e3a5f;
          color: #ffffff;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          border: none;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          margin-top: 1.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.2s;
        }
        .cat-retry-btn:hover, .cat-clear-btn-large:hover {
          background-color: #0f172a;
        }

        /* -------------------------------------------------------------
           PAGINATION
           ------------------------------------------------------------- */
        .cat-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 3rem;
        }
        .cat-page-btn {
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem; /* rounded-md */
          font-size: 0.95rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cat-page-btn:hover:not(:disabled) {
          border-color: #1e3a5f;
          color: #1e3a5f;
        }
        .cat-page-btn.active {
          background-color: #1e3a5f; /* active highlight */
          border-color: #1e3a5f;
          color: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(30, 58, 95, 0.2);
        }
        .cat-page-btn:disabled {
          background-color: #f8fafc;
          opacity: 0.4;
          cursor: not-allowed;
        }
        .cat-page-dots {
          color: #94a3b8;
          padding: 0 0.25rem;
          font-weight: 600;
        }

        /* -------------------------------------------------------------
           OFF-CANVAS DRAWER (Trượt từ trái, nền mờ đen)
           ------------------------------------------------------------- */
        .cat-drawer {
          position: fixed;
          top: 0; left: -100%;
          width: 320px;
          height: 100vh;
          background-color: #ffffff;
          z-index: 1050; /* Frontmost */
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
        }
        .cat-drawer.open { left: 0; }
        
        .cat-drawer-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5); /* bg-black/50 */
          backdrop-filter: blur(2px);
          z-index: 1040;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cat-drawer-header {
          padding: 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drawer-title-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1e3a5f; /* Xanh Navy */
        }
        .drawer-title {
          font-weight: 800;
          font-size: 1.15rem;
          margin: 0;
        }
        .drawer-close-btn {
          background: none; border: none; cursor: pointer; color: #94a3b8;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .drawer-close-btn:hover { color: #0f172a; }

        .cat-drawer-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
        .cat-drawer-body::-webkit-scrollbar { width: 6px; }
        .cat-drawer-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

        .cat-drawer-footer {
          padding: 1.5rem;
          border-top: 1px solid #f1f5f9;
          background-color: #ffffff;
        }
        .cat-apply-btn {
          width: 100%;
          background-color: #1e3a5f; /* Xanh Navy */
          color: #ffffff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.875rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .cat-apply-btn:hover { background-color: #0f172a; }

        /* Component style inside Drawer */
        .cat-filter-header-inline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .cat-clear-btn {
          font-size: 0.85rem;
          color: #3b82f6; /* Blue action link */
          background: none; border: none; font-weight: 600; cursor: pointer;
        }
        .cat-clear-btn:hover { text-decoration: underline; color: #2563eb; }

        .cat-filter-group {
          margin-bottom: 2rem;
        }
        .cat-group-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e3a5f;
          margin-bottom: 1rem;
        }

        /* Buttons/Chips Filter */
        .cat-chip-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .cat-chip-btn {
          background-color: #f3f4f6; /* bg-gray-100 */
          color: #374151; /* Đậm cho dễ đọc */
          border: none;
          border-radius: 9999px; /* rounded-full */
          padding: 0.25rem 0.75rem; /* px-3 py-1 */
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cat-chip-btn:hover {
          background-color: #e5e7eb;
        }
        .cat-chip-btn.active {
          background-color: #1e3a8a; /* Xanh navy sâu, bg-blue-900 */
          color: #ffffff;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
        }

        .cat-price-row {
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 0.75rem;
        }
        .cat-price-input {
          width: 100%;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 0.95rem;
        }
        .cat-price-sep { color: #94a3b8; font-weight: 500;}

        /* -------------------------------------------------------------
           RESPONSIVE BREAKPOINTS
           ------------------------------------------------------------- */
        @media (max-width: 1024px) {
          .cat-product-grid { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
          .cat-main-title { font-size: 2rem; }
        }

        @media (max-width: 768px) {
          .cat-product-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .cat-toolbar { flex-direction: column; align-items: stretch; gap: 1rem; }
          .cat-toolbar-left { justify-content: space-between; }
          .cat-sort-wrapper { justify-content: space-between; }
          .cat-sort-label { display: none; }
          .cat-sort-trigger { width: 100%; justify-content: space-between; }
          .cat-sort-dropdown { width: 100%; right: 0; }
          .cat-drawer { width: 85%; max-width: 340px; }
        }
      `}</style>
    </div>
  );
};

export default Category;