// Dữ liệu mẫu trích xuất từ file .sql và bổ sung theo hình ảnh giao diện
export const mockUsers = [
  {
    id: 1,
    ten_dang_nhap: 'admin',
    email: 'admin@gmail.com',
    mat_khau: '123456',
    role: 'admin'
  },
  {
    id: 2,
    ten_dang_nhap: 'Test User',
    email: 'test@gmail.com',
    mat_khau: '123456',
    role: 'khach_hang'
  }
];

export const mockCategories = [
  { id: 1, ten_loai: 'Tiểu thuyết' },
  { id: 2, ten_loai: 'Khoa học' },
  { id: 3, ten_loai: 'Thiếu nhi' },
  { id: 4, ten_loai: 'Lập trình' },
  { id: 5, ten_loai: 'Kinh tế' },
  { id: 6, ten_loai: 'Truyện tranh' }
];

export const mockBooks = [
  {
    id: 1,
    ten_sach: 'Tất Cả Đều Là Chuyện Nhỏ (Khổ Lớn) (Tái Bản 2021)',
    tac_gia: 'Richard Carlson',
    nha_xuat_ban: 'NXB Trẻ',
    gia: 49000,
    so_luong: 50,
    mo_ta: 'Cuốn sách giúp bạn nhìn nhận cuộc sống nhẹ nhàng hơn.',
    anh_bia: 'https://picsum.photos/seed/book1/300/400',
    loai_sach_id: 5
  },
  {
    id: 2,
    ten_sach: 'Thám Tử Lừng Danh Conan - Tập 107',
    tac_gia: 'Gosho Aoyama',
    nha_xuat_ban: 'Kim Đồng',
    gia: 23750,
    so_luong: 100,
    mo_ta: 'Hành trình phá án của thám tử nhí Conan.',
    anh_bia: 'https://picsum.photos/seed/book2/300/400',
    loai_sach_id: 6
  },
  {
    id: 3,
    ten_sach: 'Đắc Nhân Tâm',
    tac_gia: 'Dale Carnegie',
    nha_xuat_ban: 'NXB Trẻ',
    gia: 70000,
    so_luong: 40,
    mo_ta: 'Sách kỹ năng sống kinh điển nhất mọi thời đại.',
    anh_bia: 'https://picsum.photos/seed/book3/300/400',
    loai_sach_id: 5
  },
  {
    id: 4,
    ten_sach: 'Còn Chút Gì Để Nhớ (2022)',
    tac_gia: 'Nguyễn Nhật Ánh',
    nha_xuat_ban: 'NXB Trẻ',
    gia: 93000,
    so_luong: 35,
    mo_ta: 'Truyện dài của nhà văn Nguyễn Nhật Ánh.',
    anh_bia: 'https://picsum.photos/seed/book4/300/400',
    loai_sach_id: 1
  },
  {
    id: 5,
    ten_sach: 'Myanmar - Truyện Không Phải Truyện',
    tac_gia: 'Âu Minh',
    nha_xuat_ban: 'NXB Trẻ',
    gia: 76500,
    so_luong: 20,
    mo_ta: 'Ghi chép về đất nước Myanmar.',
    anh_bia: 'https://picsum.photos/seed/book5/300/400',
    loai_sach_id: 1
  },
  {
    id: 6,
    ten_sach: 'Truyện Kiều - Kim Vân Kiều Tân Truyện',
    tac_gia: 'Nguyễn Du',
    nha_xuat_ban: 'NXB Văn Học',
    gia: 68000,
    so_luong: 15,
    mo_ta: 'Kiệt tác văn học Việt Nam.',
    anh_bia: 'https://picsum.photos/seed/book6/300/400',
    loai_sach_id: 1
  },
  {
    id: 7,
    ten_sach: 'Truyện Ma',
    tac_gia: 'M.R. James',
    nha_xuat_ban: 'NXB Văn Học',
    gia: 126000,
    so_luong: 10,
    mo_ta: 'Tập hợp những câu chuyện ma rùng rợn.',
    anh_bia: 'https://picsum.photos/seed/book7/300/400',
    loai_sach_id: 1
  },
  {
    id: 8,
    ten_sach: 'Câu Chữ Truyện Kiều',
    tac_gia: 'Nhiều tác giả',
    nha_xuat_ban: 'NXB Trẻ',
    gia: 89000,
    so_luong: 25,
    mo_ta: 'Phân tích cái hay của Truyện Kiều.',
    anh_bia: 'https://picsum.photos/seed/book8/300/400',
    loai_sach_id: 1
  }
];
