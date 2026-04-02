<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NguoidungController;
use App\Http\Controllers\SachController;
use App\Http\Controllers\DonhangController;

Route::apiResource('nguoidung', NguoidungController::class);
Route::post('/login',[NguoidungController::class,'login']);
Route::post('/register',[NguoidungController::class,'acpregister']);

Route::apiResource('sach', SachController::class);
Route::apiResource('donhang', DonhangController::class);



