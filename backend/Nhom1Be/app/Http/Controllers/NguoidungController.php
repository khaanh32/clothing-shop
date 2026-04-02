<?php

namespace App\Http\Controllers;
use App\Models\Nguoidung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class NguoidungController extends Controller
{
    public function index()
    {
        return Nguoidung::all();
    }

    public function store(Request $request)
    {
        return Nguoidung::create($request->all());
    }

    public function show($id)
    {
        return Nguoidung::find($id);
    }

    public function update(Request $request, $id)
    {
        $user = Nguoidung::find($id);
        $user->update($request->all());

        return $user;
    }

    public function destroy($id)
    {
        return Nguoidung::destroy($id);
    }
    public function acpregister(Request $request) {
        $request->validate([
            'ten_dang_nhap' => 'required|string|max:100|unique:nguoidung,ten_dang_nhap',
            'mat_khau'      => 'required|string|min:6|confirmed',
            'email'         => 'required|email|max:255|unique:nguoidung,email',
            'so_dien_thoai' => 'required|string|max:20',
            'dia_chi'       => 'required|string',
        ]);
        try {
            $user = Nguoidung::create([
                'ten_dang_nhap' => $request->ten_dang_nhap,
                'mat_khau'      => Hash::make($request->mat_khau),
                'email'         => $request->email,
                'so_dien_thoai' => $request->so_dien_thoai,
                'dia_chi'       => $request->dia_chi,
                'role'          => 'khach_hang',
                'provider'      => 'local'
            ]);
            return response()->json([
                'message' => 'Đăng ký tài khoản thành công!',
                'user' => $user
            ], 201);
                            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'mat_khau' => 'required'
        ]);
        $user = Nguoidung::where('email', $request->email)->first();
    if (!$user || !Hash::check($request->mat_khau, $user->mat_khau)) {
        return response()->json([
            "message" => "Sai email hoặc mật khẩu"
        ], 401);
    }
    $token = $user->createToken('auth_token')->plainTextToken;
    return response()->json([
        'message'      => 'Đăng nhập thành công',
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => [
            'id'            => $user->id,
            'ten_dang_nhap' => $user->ten_dang_nhap,
            'email'         => $user->email,
            'role'          => $user->role
        ]
    ], 200);
    }
}
