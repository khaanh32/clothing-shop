import axiosClient from '../axiosClient';

export const bookAPI = {
  getAll: () => axiosClient.get('/sach'),
  getFiltered: (params) => axiosClient.get('/sach/filter', { params }),
  getDetail: (id) => axiosClient.get(`/sach/${id}`),
};

export const cartAPI = {
  getCart: () => axiosClient.get('/giohang'),
  addToCart: (data) => axiosClient.post('/chitietgiohang/them', data),
  updateQuantity: (sach_id, so_luong) => axiosClient.put(`/chitietgiohang/${sach_id}`, { so_luong }),
  removeItem: (sach_id) => axiosClient.delete(`/chitietgiohang/${sach_id}`),
};

export const orderAPI = {
  checkout: (data) => axiosClient.post('/checkout', data),
  getOrders: () => axiosClient.get('/donhang'),
  getOrderDetail: (id) => axiosClient.get(`/donhang/${id}`),
  cancelOrder: (id) => axiosClient.delete(`/donhang/${id}`),
};

export const userAPI = {
  getProfile: (id) => axiosClient.get(`/nguoidung/${id}`),
  updateProfile: (id, data) => axiosClient.put(`/nguoidung/${id}`, data),
};