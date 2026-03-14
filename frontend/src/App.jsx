import { useState, useEffect } from 'react';

function App() {
  const [sinhViens, setSinhViens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy link API từ biến môi trường
  const API_URL = import.meta.env.VITE_API_URL || "https://webchieut6-1.onrender.com/api";

  useEffect(() => {
    // Gọi đến đúng endpoint /sinhvien trong Controller của bạn
    fetch(`${API_URL}/sinhvien`)
      .then((res) => res.json())
      .then((data) => {
        setSinhViens(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Danh Sách Sinh Viên</h2>
      
      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Mã Sinh Viên</th>
              <th>Họ Tên</th>
              <th>Lớp</th>
              <th>Ngày Tạo</th>
            </tr>
          </thead>
          <tbody>
            {sinhViens.map((sv) => (
              <tr key={sv.id}>
                <td>{sv.id}</td>
                <td>{sv.maSinhVien}</td>
                <td>{sv.hoTen}</td>
                <td>{sv.lop}</td>
                <td>{new Date(sv.ngayTao).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {sinhViens.length === 0 && !loading && (
        <p className="text-center">Không có dữ liệu sinh viên.</p>
      )}
    </div>
  );
}

export default App;
