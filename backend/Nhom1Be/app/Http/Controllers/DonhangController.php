<?php

namespace App\Http\Controllers;
use App\Models\Donhang;
use Illuminate\Http\Request;

class DonhangController extends Controller
{
    public function index()
    {
        return Donhang::with('nguoidung')->get();
    }
    public function store(Request $request)
    {
        return Donhang::create($request->all());
    }
    public function show($id)
    {
        return Donhang::find($id);
    }
    public function update(Request $request,$id)
    {
        $donhang = Donhang::find($id);
        $donhang->update($request->all());
        return $donhang;
    }
    public function destroy($id)
    {
        return Donhang::destroy($id);
    }
}
