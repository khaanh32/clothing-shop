<?php

namespace App\Http\Controllers;
use App\Models\Giohang;
use Illuminate\Http\Request;

class GiohangController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $giohang = Giohang::with('chitietgiohang.sach')
                        ->firstOrCreate(
                            ['nguoi_dung_id' => $userId],
                        );
        return response()->json([
            'success' => true,
            'data' => $giohang
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
    public function destroy($id)
    {
        $giohang = Giohang::findOrFail($id);
        $giohang->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa giỏ hàng'
        ]);
    }
}
