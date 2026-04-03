<?php

namespace App\Http\Controllers;

use App\Models\Chitietdonhang;
use App\Models\Donhang;
use App\Models\Giohang;
use App\Models\Sach;
use App\Models\Thanhtoan;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DonhangController extends Controller
{
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'ten_nguoi_nhan'         => 'required|string|max:255',
            'sdt_nguoi_nhan'         => 'required|string|max:20',
            'dia_chi_giao_hang'      => 'required|string|max:255',
            'phuong_thuc_thanh_toan' => 'required|in:COD,ONLINE', // Chỉ cho phép COD hoặc ONLINE
            'ghi_chu'                => 'nullable|string'
        ]);
        $userId = $request->user()->id;
        $giohang = Giohang::with('chitietgiohangs')->where('nguoi_dung_id', $userId)->first();

        if (!$giohang || $giohang->chitietgiohangs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Giỏ hàng của bạn đang trống!'
            ], 400);
        }
        try {
            DB::beginTransaction();
            $tongTien = 0;
            $tongSoLuongSach = 0;
            foreach ($giohang->chitietgiohangs as $item) {
                $tongTien += $item->thanh_tien;
                $tongSoLuongSach += $item->so_luong;
            }
            $donhang = Donhang::create([
                'nguoi_dung_id'          => $userId,
                'tong_tien'              => $tongTien,
                'thanh_tien'             => $tongTien,
                'trang_thai'             => 'CHỜ_XÁC_NHẬN',
                'ten_nguoi_nhan'         => $validated['ten_nguoi_nhan'],
                'sdt_nguoi_nhan'         => $validated['sdt_nguoi_nhan'],
                'dia_chi_giao_hang'      => $validated['dia_chi_giao_hang'],
                'so_luong_sach'          => $tongSoLuongSach,
                'phuong_thuc_thanh_toan' => $validated['phuong_thuc_thanh_toan'],
                'ghi_chu'                => $validated['ghi_chu'] ?? null,
            ]);
            foreach ($giohang->chitietgiohangs as $item) {
                $sach = Sach::lockForUpdate()->find($item->sach_id);
                
                if (!$sach || $sach->so_luong < $item->so_luong) {
                    throw new \Exception("Sách '{$sach->ten_sach}' không đủ số lượng trong kho.");
                }
                $sach->decrement('so_luong', $item->so_luong);
                Chitietdonhang::create([
                    'don_hang_id' => $donhang->id,
                    'sach_id'     => $item->sach_id,
                    'so_luong'    => $item->so_luong,
                    'don_gia'     => $item->don_gia,
                    'thanh_tien'  => $item->thanh_tien
                ]);
            }
            Thanhtoan::create([
                'don_hang_id'     => $donhang->id,
                'phuong_thuc'     => $validated['phuong_thuc_thanh_toan'],
                'so_tien'         => $tongTien,
                'trang_thai'      => 'CHUA_THANH_TOAN',
            ]);

            $giohang->chitietgiohangs()->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đặt hàng thành công!',
                'don_hang_id' => $donhang->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Quá trình đặt hàng thất bại: ' . $e->getMessage()
            ], 500);
        }
    }
}
