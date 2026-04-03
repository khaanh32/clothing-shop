<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NguoidungController;
use App\Http\Controllers\SachController;
use App\Http\Controllers\DonhangController;
use App\Http\Controllers\GiohangController;
use App\Http\Controllers\ChitietgiohangController;

Route::post('/login',[NguoidungController::class,'login']);
Route::post('/register',[NguoidungController::class,'acpregister']);
Route::get('/sach', [SachController::class, 'index']);
Route::get('/sach/{id}', [SachController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/giohang', [GiohangController::class, 'index']);
    Route::delete('/giohang/{id}', [GiohangController::class, 'destroy']);
    Route::put('/nguoidung/{id}', [NguoidungController::class, 'update']);
    Route::apiResource('donhang', DonhangController::class);
    Route::get('/nguoidung', [NguoidungController::class, 'index']);
    Route::get('/nguoidung/{id}', [NguoidungController::class, 'show']);
    Route::post('/chitietgiohang/them', [ChitietgiohangController::class, 'add']);
    Route::post('/checkout', [DonhangController::class, 'checkout']);
});




