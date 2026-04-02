<?php

namespace App\Http\Controllers;
use App\Models\Sach;
use Illuminate\Http\Request;

class SachController extends Controller
{
    public function index()
    {
        return Sach::with('loaisach')->get();
    }

    public function store(Request $request)
    {
        return Sach::create($request->all());
    }

    public function show($id)
    {
        return Sach::find($id);
    }

    public function update(Request $request,$id)
    {
        $sach = Sach::find($id);
        $sach->update($request->all());

        return $sach;
    }

    public function destroy($id)
    {
        return Sach::destroy($id);
    }
    
}
