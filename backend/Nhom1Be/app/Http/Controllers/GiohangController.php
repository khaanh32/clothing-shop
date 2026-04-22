<?php

namespace App\Http\Controllers;
use App\Models\Giohang;
use Illuminate\Http\Request;

class GiohangController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $giohang = Giohang::with('chitietgiohangs.sach')
                        ->firstOrCreate(
                            ['nguoi_dung_id' => $userId]
                        );
        $tongTienThanhToan = 0;
        if ($giohang->chitietgiohang) {
            foreach ($giohang->chitietgiohang as $item) {
                $tongTienThanhToan += $item->thanh_tien;
            }
        }
        return response()->json([
            'success' => true,
            'data' => [
                'thong_tin_gio_hang'   => $giohang,
                'tong_tien_thanh_toan' => $tongTienThanhToan
            ]
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nguoi_dung_id' => 'required|exists:nguoidung,id|unique:giohang,nguoi_dung_id'
        ]);

        $giohang = Giohang::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Đã tạo giỏ hàng',
            'data' => $giohang
        ], 201);
    }
    function update(Request $request, $id)
    {
        $giohang = Giohang::find($id);
        if (!$giohang) {
            return response()->json([
                'success' => false,
                'message' => 'Giỏ hàng không tồn tại'
            ], 404);
        }
        $validated = $request->validate([
            'nguoi_dung_id' => 'required|exists:nguoidung,id|unique:giohang,nguoi_dung_id,' . $id
        ]);
        $giohang->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Đã cập nhật giỏ hàng',
            'data' => $giohang
        ]);
    }
}
