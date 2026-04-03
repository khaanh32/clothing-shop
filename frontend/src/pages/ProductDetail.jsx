import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { ArrowLeft, ShoppingCart, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        // Giả sử API lấy chi tiết là /sach/{id}
        const response = await axiosClient.get(`/sach/${id}`);
        const bookData = response.data.data || response.data;
        setBook(bookData);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
        toast.error("Không tìm thấy thông tin sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }
    try {
      await axiosClient.post("/chitietgiohang/them", {
        sach_id: book.id,
        so_luong: 1,
      });
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-20 text-center font-bold text-xl">
        Đang tải...
      </div>
    );
  if (!book)
    return (
      <div className="container mx-auto px-4 py-20 text-center font-bold text-xl">
        Không tìm thấy sản phẩm
      </div>
    );

  return (
    <div className="container py-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link to="/category" className="view-all">
          <ArrowLeft
            style={{
              width: "1.25rem",
              height: "1.25rem",
              marginRight: "0.5rem",
            }}
          />{" "}
          Quay lại
        </Link>
      </div>

      <div className="detail-card">
        {/* Product Image */}
        <div className="detail-img-wrapper">
          <img
            src={
              book.anh_bia || "https://picsum.photos/seed/book-detail/600/800"
            }
            alt={book.ten_sach}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Product Info */}
        <div className="detail-info">
          <h1>{book.ten_sach}</h1>
          <p className="detail-price">
            {formatPrice(book.gia_ban || book.gia)}
          </p>
          <p
            style={{ color: "#6b7280", fontWeight: 500, marginBottom: "2rem" }}
          >
            Còn hàng
          </p>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Nhà cung cấp:</span>
              <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                {book.nha_xuat_ban || "NXB Trẻ"}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Tác giả:</span>
              <span style={{ fontWeight: "bold" }}>
                {book.tac_gia || "Nguyễn Nhật Ánh"}
              </span>
            </div>
          </div>

          <div className="detail-actions">
            <button className="buy-now" onClick={() => navigate("/checkout")}>
              Mua ngay
            </button>
            <button className="add-cart" onClick={handleAddToCart}>
              <div style={{ position: "relative" }}>
                <ShoppingCart
                  style={{ width: "2rem", height: "2rem", color: "#334155" }}
                />
                <Plus
                  style={{
                    width: "1rem",
                    height: "1rem",
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "#fff",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ gridColumn: "1 / -1", marginTop: "4rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
            }}
          >
            Thông tin thêm
          </h2>
          <div
            style={{
              color: "#374151",
              lineHeight: 1.6,
              fontSize: "1.125rem",
              whiteSpace: "pre-line",
              fontStyle: "italic",
            }}
          >
            {book.mo_ta ||
              `Cái gì cũng có thể xảy ra...
            Đó là những kỷ niệm thời đi học của Chương, lúc mới bước chân vào Sài Gòn và làm quen với cuộc sống đô thị.
            Là những mối quan hệ bạn bè tưởng chừng hời hợt thoáng qua nhưng gắn bó suốt cuộc đời.
            Cuộc sống đầy biến động đã xô dạt mỗi người mỗi nơi, nhưng trải qua hàng mấy chục năm, những kỷ niệm ấy vẫn luôn níu kéo Chương về với một thời để nhớ.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
