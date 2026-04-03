<?php

namespace App\Http\Controllers;
use App\Models\Chitietgiohang;
use App\Models\Giohang;
use App\Models\Sach;
use Illuminate\Http\Request;

class ChitietgiohangController extends Controller
{
    public function add(Request $request)
    {

        $request->validate([
            'sach_id'  => 'required|exists:sach,id',
            'so_luong' => 'nullable|integer|min:1'
        ]);
        $userId = $request->user()->id;
        $sachId = $request->sach_id;
        $soLuongThem = $request->so_luong ?? 1;

        $giohang = Giohang::firstOrCreate(['nguoi_dung_id' => $userId]);

        $sach = Sach::findOrFail($sachId);
        
        if ($sach->so_luong < $soLuongThem) {
            return response()->json([
                'success' => false, 
                'message' => 'Số lượng sách trong kho không đủ!'
            ], 400);
        }

        $chiTiet = Chitietgiohang::where('gio_hang_id', $giohang->id)
                                ->where('sach_id', $sachId)
                                ->first();
        if ($chiTiet) {
            $soLuongMoi = $chiTiet->so_luong + $soLuongThem;
                if ($sach->so_luong < $soLuongMoi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng vượt quá tồn kho!'
                ], 400);
            }
            $chiTiet->update([
                'so_luong'   => $soLuongMoi,
                'thanh_tien' => $soLuongMoi * $chiTiet->don_gia
            ]);
        } else {
            $chiTiet = Chitietgiohang::create([
                'gio_hang_id' => $giohang->id,
                'sach_id'     => $sachId,
                'so_luong'    => $soLuongThem,
                'don_gia'     => $sach->gia,
                'thanh_tien'  => $soLuongThem * $sach->gia
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'Đã thêm sách vào giỏ hàng!',
            'data'    => $chiTiet
        ]);
    }
}
