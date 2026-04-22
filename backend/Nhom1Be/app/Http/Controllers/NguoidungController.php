<?php

namespace App\Http\Controllers;
use App\Models\Nguoidung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
class NguoidungController extends Controller
{
    public function show($id)
    {
        $user = Nguoidung::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = Nguoidung::findOrFail($id);
        
        $validatedData = $request->validate([
            'ten_dang_nhap' => 'sometimes|string|max:100|unique:nguoidung,ten_dang_nhap,' . $id,
            'email'         => 'sometimes|email|max:255|unique:nguoidung,email,' . $id,
            'so_dien_thoai' => 'nullable|string|max:20',
            'dia_chi'       => 'nullable|string',
            'mat_khau'      => 'sometimes|string|min:6',
        ]);

        if ($request->filled('mat_khau')) {
            $validatedData['mat_khau'] = Hash::make($request->mat_khau);
        }

        $user->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin thành công',
            'data'    => $user
        ]);
    }
    public function acpregister(Request $request)
    {
        try {

            $validated = $request->validate([
                'ten_dang_nhap' => 'required|string|max:255|unique:nguoidung,ten_dang_nhap',
                'email' => 'required|email|unique:nguoidung,email',
                'mat_khau' => 'required|min:6|confirmed',
                'so_dien_thoai' => 'required|max:10|unique:nguoidung,so_dien_thoai',
                'dia_chi' => 'required'
            ]);
            $user = Nguoidung::create([
                'ten_dang_nhap' => $validated['ten_dang_nhap'],
                'email' => $validated['email'],
                'mat_khau' => bcrypt($validated['mat_khau']),
                'so_dien_thoai' => $validated['so_dien_thoai'],
                'dia_chi' => $validated['dia_chi'],
                'role' => 'khach_hang',
                'provider'=> 'local'
            ]);
            return response()->json([
                "success" => true,
                "message" => "Đăng ký thành công",
                "data" => $user
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                "success" => false,
                "message" => "Dữ liệu không hợp lệ",
                "errors" => $e->errors()
            ], 422);

        } catch (\Exception $e) {

            return response()->json([
                "success" => false,
                "message" => "Lỗi server",
                "error" => $e->getMessage()
            ], 500);
        }
    }
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email'    => 'required|email',
                'mat_khau' => 'required'
            ],[
                'email.required' => 'Vui lòng nhập email',
                'email.email' => 'Email không hợp lệ',
                'mat_khau.required' => 'Vui lòng nhập mật khẩu'
            ]);
            $user = Nguoidung::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "Tài khoản không tồn tại"
                ], 404);
            }
            if (!Hash::check($request->mat_khau, $user->mat_khau)) {
                return response()->json([
                    "success" => false,
                    "message" => "Mật khẩu không đúng"
                ], 401);
            }
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'success'      => true,
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
        } catch (ValidationException $e) {
            return response()->json([
                "success" => false,
                "message" => "Thiếu thông tin đăng nhập",
                "errors" => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Lỗi server",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
