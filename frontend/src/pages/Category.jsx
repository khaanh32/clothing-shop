import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { mockCategories } from '../api/mockData';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const Category = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const booksPerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosClient.get('/sach');
        const allBooks = response.data.data || response.data;
        const booksArray = Array.isArray(allBooks) ? allBooks : [];
        setBooks(booksArray);
        setFilteredBooks(booksArray);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Logic lọc và sắp xếp
  useEffect(() => {
    let result = [...books];

    // Lọc theo danh mục
    if (selectedCategory) {
      result = result.filter(b => b.loai_sach_id === selectedCategory);
    }

    // Sắp xếp
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.gia - b.gia);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.gia - a.gia);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [selectedCategory, sortBy, books]);

  // Logic phân trang
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price-asc': return 'Giá Thấp Đến Cao';
      case 'price-desc': return 'Giá Cao Đến Thấp';
      case 'newest': return 'Mới Nhất';
      default: return 'Sắp Xếp';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link to="/" className="view-all">
          <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Quay lại
        </Link>
      </div>

      <div className="category-layout">
        {/* Sidebar Filter */}
        <aside className="sidebar">
          <div className="filter-box">
            <div className="filter-title">
              
              <h2>Danh mục</h2>
            </div>
            
            <div className="category-list">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
              >
                Tất cả sách
              </button>
              {mockCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.ten_loai}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-header">
            <p style={{ color: '#6b7280', fontWeight: 500 }}>Hiển thị {filteredBooks.length} kết quả</p>
            <div className="sort-wrapper">
              <span style={{ color: '#4b5563', fontWeight: 500 }}>Sắp xếp theo:</span>
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="sort-btn"
              >
                <span>{getSortLabel()}</span>
                <ChevronDown style={{ width: '1rem', height: '1rem', transition: 'transform 0.2s', transform: showSortMenu ? 'rotate(180deg)' : 'none' }} />
              </button>

              {showSortMenu && (
                <div className="sort-menu">
                  <button 
                    onClick={() => { setSortBy('newest'); setShowSortMenu(false); }}
                    className={`sort-item ${sortBy === 'newest' ? 'active' : ''}`}
                  >
                    Mới Nhất
                  </button>
                  <button 
                    onClick={() => { setSortBy('price-asc'); setShowSortMenu(false); }}
                    className={`sort-item ${sortBy === 'price-asc' ? 'active' : ''}`}
                  >
                    Giá Thấp Đến Cao
                  </button>
                  <button 
                    onClick={() => { setSortBy('price-desc'); setShowSortMenu(false); }}
                    className={`sort-item ${sortBy === 'price-desc' ? 'active' : ''}`}
                  >
                    Giá Cao Đến Thấp
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="product-grid">
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} style={{ background: '#f3f4f6', aspectRatio: '3/4', borderRadius: '1rem' }}></div>)
            ) : (
              currentBooks.length > 0 ? (
                currentBooks.map(book => <ProductCard key={book.id} sach={book} />)
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '5rem 0', textAlign: 'center', color: '#6b7280' }}>
                  Không tìm thấy sản phẩm nào trong danh mục này.
                </div>
              )
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                className="page-btn"
              >
                <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                className="page-btn"
              >
                <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
