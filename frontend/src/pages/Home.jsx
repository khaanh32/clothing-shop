import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Zap, BookOpen } from 'lucide-react';

const Home = () => {
  const [flashSaleBooks, setFlashSaleBooks] = useState([]);
  const [storyBooks, setStoryBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosClient.get('/sach');
        const allBooks = response.data.data.data; 
        
        if (Array.isArray(allBooks)) {
            setFlashSaleBooks(allBooks.slice(0, 4));
            setStoryBooks(allBooks.slice(4, 8));
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container home-container">
      {/* Banner */}
      <div className="banner">
        <img 
          src="https://picsum.photos/seed/bookstore-banner/1200/400" 
          alt="Banner" 
          className="banner-img"
          referrerPolicy="no-referrer"
        />
        <div className="banner-content">
          <div className="banner-badge">
            Khám phá nguồn tri thức bất tận
          </div>
        </div>
      </div>

      {/* Flash Sale Section */}
      <section>
        <div className="section-header">
          <div className="section-title bg-flash-sale">
            <Zap style={{ width: '1.25rem', height: '1.25rem', fill: 'currentColor' }} />
            <span>FLASH SALE</span>
          </div>
          <Link to="/category" className="view-all">
            Xem tất cả <ChevronRight style={{ width: '1rem', height: '1rem', marginLeft: '0.25rem' }} />
          </Link>
        </div>
        
        <div className="product-grid">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} style={{ background: '#f3f4f6', aspectRatio: '3/4', borderRadius: '1rem' }}></div>)
          ) : (
            flashSaleBooks.map(book => <ProductCard key={book.id} sach={book} />)
          )}
        </div>
      </section>

      {/* Truyện Section */}
      <section>
        <div className="section-header">
          <div className="section-title bg-truyen">
            <BookOpen style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>TRUYỆN</span>
          </div>
          <Link to="/category" className="view-all">
            Xem tất cả <ChevronRight style={{ width: '1rem', height: '1rem', marginLeft: '0.25rem' }} />
          </Link>
        </div>
        
        <div className="product-grid">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} style={{ background: '#f3f4f6', aspectRatio: '3/4', borderRadius: '1rem' }}></div>)
          ) : (
            storyBooks.map(book => <ProductCard key={book.id} sach={book} />)
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
